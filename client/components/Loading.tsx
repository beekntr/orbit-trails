import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export default function Loading({
  fullScreen = false,
  message = "Loading...",
}: LoadingProps) {
  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <MapPin className="w-8 h-8 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F2c9c81af121b4295995eefbb00e5f72c%2F511b4da1cf1145e0bda7151f95f585e3?format=webp&width=200"
              alt="Orbit Trails"
              className="h-8 w-auto mx-auto mb-4"
            />
            <p className="text-secondary font-medium">{message}</p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-1 bg-primary mt-3 rounded-full max-w-32 mx-auto"
            />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3"
      >
        <MapPin className="w-4 h-4 text-white" />
      </motion.div>
      <span className="text-secondary">{message}</span>
    </div>
  );
}
