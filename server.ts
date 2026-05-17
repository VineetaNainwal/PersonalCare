import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'renalflow.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    type TEXT DEFAULT 'lab',
    weight REAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Add missing columns if they don't exist
const optionalColumns = [
  { name: 'rur_protein', type: 'REAL' },
  { name: 'rur_creatinine', type: 'REAL' },
  { name: 'rur_pc_ratio', type: 'REAL' },
  { name: 'rur_ac_ratio', type: 'REAL' },
  { name: 'rhm_hb', type: 'REAL' },
  { name: 'rhm_wbc', type: 'REAL' },
  { name: 'rhm_platelets', type: 'REAL' },
  { name: 'rhm_hematocrit', type: 'REAL' },
  { name: 'rhm_rbc', type: 'REAL' },
  { name: 'rch_urea', type: 'REAL' },
  { name: 'rch_creatinine', type: 'REAL' },
  { name: 'rst_tac_level', type: 'REAL' },
  { name: 'creatinine', type: 'REAL' },
  { name: 'bp_sys', type: 'INTEGER' },
  { name: 'bp_dia', type: 'INTEGER' },
  { name: 'urine_output', type: 'REAL' }
];

for (const col of optionalColumns) {
  try {
    db.exec(`ALTER TABLE medical_records ADD COLUMN ${col.name} ${col.type}`);
  } catch (error) {
    // Column already exists, ignore error
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/reports", (req, res) => {
    try {
      const records = db.prepare('SELECT * FROM medical_records ORDER BY date DESC').all();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/reports", (req, res) => {
    const { 
      date, type, weight, notes,
      rur_protein, rur_creatinine, rur_pc_ratio, rur_ac_ratio,
      rhm_hb, rhm_wbc, rhm_platelets, rhm_hematocrit, rhm_rbc,
      rch_urea, rch_creatinine,
      rst_tac_level,
      creatinine, bp_sys, bp_dia, urine_output
    } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO medical_records (
          date, type, weight, notes,
          rur_protein, rur_creatinine, rur_pc_ratio, rur_ac_ratio,
          rhm_hb, rhm_wbc, rhm_platelets, rhm_hematocrit, rhm_rbc,
          rch_urea, rch_creatinine,
          rst_tac_level,
          creatinine, bp_sys, bp_dia, urine_output
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        date, type, weight, notes,
        rur_protein, rur_creatinine, rur_pc_ratio, rur_ac_ratio,
        rhm_hb, rhm_wbc, rhm_platelets, rhm_hematocrit, rhm_rbc,
        rch_urea, rch_creatinine,
        rst_tac_level,
        creatinine, bp_sys, bp_dia, urine_output
      );
      res.json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/reports/:id", (req, res) => {
    const { id } = req.params;
    const { 
      date, type, weight, notes,
      rur_protein, rur_creatinine, rur_pc_ratio, rur_ac_ratio,
      rhm_hb, rhm_wbc, rhm_platelets, rhm_hematocrit, rhm_rbc,
      rch_urea, rch_creatinine,
      rst_tac_level,
      creatinine, bp_sys, bp_dia, urine_output
    } = req.body;
    try {
      const stmt = db.prepare(`
        UPDATE medical_records 
        SET date = ?, type = ?, weight = ?, notes = ?,
            rur_protein = ?, rur_creatinine = ?, rur_pc_ratio = ?, rur_ac_ratio = ?,
            rhm_hb = ?, rhm_wbc = ?, rhm_platelets = ?, rhm_hematocrit = ?, rhm_rbc = ?,
            rch_urea = ?, rch_creatinine = ?,
            rst_tac_level = ?,
            creatinine = ?, bp_sys = ?, bp_dia = ?, urine_output = ?
        WHERE id = ?
      `);
      stmt.run(
        date, type, weight, notes,
        rur_protein, rur_creatinine, rur_pc_ratio, rur_ac_ratio,
        rhm_hb, rhm_wbc, rhm_platelets, rhm_hematocrit, rhm_rbc,
        rch_urea, rch_creatinine,
        rst_tac_level,
        creatinine, bp_sys, bp_dia, urine_output,
        id
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/reports/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM medical_records WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
