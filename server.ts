import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const upload = multer({ dest: 'uploads/' });

  app.use(express.json());

  // API routes
  app.post("/api/factory/upload", upload.single('factoryFile'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: "No file uploaded" });
    }

    try {
      const filePath = req.file.path;
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Simulate parsing .factory file
      // We expect the file to contain JSON with lines and equipment
      const parsedData = JSON.parse(fileContent);
      
      // Clean up
      fs.unlinkSync(filePath);

      res.json({
        code: 200,
        message: "工廠文件解析成功",
        data: parsedData
      });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: "文件解析失敗: " + error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
