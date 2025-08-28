#!/usr/bin/env node

/**
 * Pre-build security check script
 * Ensures sensitive information is not exposed in production builds
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const securityChecks = {
  passed: 0,
  failed: 0,
  warnings: []
};

// Check for console.log statements in source files
function checkForConsoleLogs(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      checkForConsoleLogs(fullPath);
    } else if (file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.tsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for console statements
      const consoleMatches = content.match(/console\.(log|warn|error|info|debug)/g);
      if (consoleMatches) {
        securityChecks.failed++;
        securityChecks.warnings.push(`❌ Console statements found in ${fullPath}: ${consoleMatches.join(', ')}`);
      } else {
        securityChecks.passed++;
      }
      
      // Check for exposed API keys or secrets
      const secretMatches = content.match(/(api_key|secret|password|token)\s*[:=]\s*['"][^'"]+['"]/gi);
      if (secretMatches) {
        securityChecks.failed++;
        securityChecks.warnings.push(`⚠️  Potential secrets exposed in ${fullPath}`);
      }
    }
  }
}

// Check environment files
function checkEnvFiles() {
  const envFiles = ['.env', '.env.local', '.env.production'];
  
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      
      // Check for localhost URLs in production env
      if (envFile.includes('production') && content.includes('localhost')) {
        securityChecks.failed++;
        securityChecks.warnings.push(`❌ Localhost URL found in ${envFile}`);
      }
      
      // Check for hardcoded secrets
      if (content.match(/password|secret.*=.*[^_]/i)) {
        securityChecks.warnings.push(`⚠️  Potential hardcoded secrets in ${envFile}`);
      }
    }
  }
}

console.log('🔐 Running security checks...\n');

// Change to project root directory
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Run checks
checkForConsoleLogs('./client');
checkForConsoleLogs('./shared');
checkEnvFiles();

// Report results
console.log(`✅ Security checks passed: ${securityChecks.passed}`);
console.log(`❌ Security checks failed: ${securityChecks.failed}\n`);

if (securityChecks.warnings.length > 0) {
  console.log('⚠️  Security warnings:');
  securityChecks.warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('');
}

if (securityChecks.failed > 0) {
  console.log('❌ Security checks failed! Please fix the issues above before deploying to production.');
  process.exit(1);
} else {
  console.log('✅ All security checks passed! Safe to deploy.');
  process.exit(0);
}
