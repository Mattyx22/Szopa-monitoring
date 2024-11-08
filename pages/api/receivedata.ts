// api/receivedata.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.resolve(process.cwd(), 'data.json');
const THRESHOLD_FILE_PATH = path.resolve(process.cwd(), 'thresholds.json');
const AUTH_TOKEN = "SECURRRE"; // Replace with a more secure token in production

const initializeFile = (filePath: string, initialData: any) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
};

const loadData = (filePath: string) => {
  initializeFile(filePath, []);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

const saveData = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for the correct token
  const token = req.headers['authorization'];
  if ((req.method === 'POST' || req.method === 'PUT') && req.headers['authorization'] !== AUTH_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { temperature, humidity } = req.body;
    const data = loadData(DATA_FILE_PATH);
    const newData = { timestamp: new Date(), temperature, humidity };
    data.push(newData);

    // Only keep data from the last 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const filteredData = data.filter((entry: any) => new Date(entry.timestamp) > twoDaysAgo);
    saveData(DATA_FILE_PATH, filteredData);

    res.status(200).json({ success: true });
  } else if (req.method === 'PUT') {
    const { temperatureThreshold, humidityThreshold } = req.body;
    saveData(THRESHOLD_FILE_PATH, { temperatureThreshold, humidityThreshold });
    res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    const data = loadData(DATA_FILE_PATH);
    const thresholds = loadData(THRESHOLD_FILE_PATH);
    res.status(200).json({ data, thresholds });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
