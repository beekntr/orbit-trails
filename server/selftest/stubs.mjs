/**
 * Test-only preload for api-server.selftest.mjs. Loaded with `node --import`
 * before the real server so it can run with no MongoDB and no mail account:
 * database writes and outgoing emails are recorded to a JSON file instead.
 * Never loaded in production.
 */
import fs from 'node:fs';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

const captureFile = process.env.SELFTEST_CAPTURE_FILE;
const captured = { saved: [], mail: [] };
const flush = () => {
  if (captureFile) fs.writeFileSync(captureFile, JSON.stringify(captured));
};
flush();

mongoose.connect = async () => mongoose;

mongoose.Model.prototype.save = async function save() {
  captured.saved.push({ model: this.constructor.modelName, doc: this.toObject() });
  flush();
  return this;
};

// Admin.findOne(...) during login: behave as if no such admin exists.
mongoose.Model.findOne = () => Promise.resolve(null);

// Admin.findById(id).select(...) in the auth check: any correctly signed token maps to an active admin.
mongoose.Model.findById = (id) => ({
  select: async () => ({ _id: id, username: 'selftest-admin', role: 'admin', isActive: true }),
});

// Tour.find(...).sort(...).lean().select(...): a chainable query that resolves to no tours.
mongoose.Model.find = () => {
  const query = {
    sort: () => query,
    lean: () => query,
    select: () => query,
    then: (resolve, reject) => Promise.resolve([]).then(resolve, reject),
  };
  return query;
};

nodemailer.createTransport = () => ({
  sendMail: async ({ to, subject, html }) => {
    captured.mail.push({ to, subject, html });
    flush();
    return {};
  },
});
