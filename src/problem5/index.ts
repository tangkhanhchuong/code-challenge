import express, { Request, Response } from 'express';
import { connectToDb, getDbClient } from './db/db';
import { PokemonTypes } from './type';
import { isValidId } from './util';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.post('/pokemon', async (req: Request, res: Response) => {
  try {
    const { name, type, ability, isShiny = false, isMale = true } = req.body;
    if (
      !name || !type || !ability ||
      !Object.values(PokemonTypes).includes(type as PokemonTypes)
    ) {
      res.status(400).json({
        message: 'Invalid input'
      });
    }
    const result = await getDbClient().query(
      `INSERT INTO "pokemon" (name, type, ability, is_shiny, is_male) VALUES ($1, $2, $3, $4,  $5) RETURNING id`,
      [name, type, ability, isShiny, isMale]
    );
    res.json({
      created: true,
      id: result.rows[0].id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get('/pokemon', async (req: Request, res: Response) => {
  try {
    let queryStr = 'SElECT * from "pokemon"';
    if (Object.keys(req.query).length > 0) {
      queryStr += ' WHERE ';
      const queries: string[] = [];
      if (req.query.name) {
        queries.push(`name like '%${req.query.name}%'`);
      }
      if (req.query.ability) {
        queries.push(`ability = '${req.query.ability}'`);
      }
      if (req.query.type) {
        queries.push(`type = '${req.query.type}'`);
      }
      if (req.query.is_male) {
        queries.push(`is_male = '${req.query.is_male}'`);
      }
      if (req.query.is_shiny) {
        queries.push(`is_shiny = '${req.query.is_shiny}'`);
      }
      if (req.query.level) {
        queries.push(`level >= '${req.query.level}'`);
      }
      queryStr += queries.join(' AND ');
    }
    queryStr += ' ORDER BY id DESC'
    const result = await getDbClient().query(queryStr);
    res.json({
      total: result.rows.length,
      items: result.rows
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get('/pokemon/:id', async (req: Request, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400).json({
        message: "Invalid id"
      });
      return;
    }

    const result = await getDbClient().query(
      `SElECT * from "pokemon" WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length == 0) {
      res.status(404).json({
        message: "No pokemon found"
      });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.patch('/pokemon/:id', async (req: Request, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400).json({
        message: "Invalid id"
      });
      return;
    }
    const { name, type, ability, isMale = true, isShiny = false, level = 1 } = req.body;
    const result = await getDbClient().query(
      `UPDATE "pokemon" SET name=$1, type=$2, ability=$3, is_male=$4, is_shiny=$5, level=$6 WHERE id = $7 RETURNING id`,
      [name, type, ability, isMale, isShiny, level, req.params.id]
    );
    if (result.rows.length == 0) {
      res.status(404).json({
        message: "No pokemon found"
      });
      return;
    }
    res.json({
      update: true,
      id: result.rows[0].id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.delete('/pokemon/:id', async (req: Request, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400).json({
        message: "Invalid id"
      });
      return;
    }
    const result = await getDbClient().query(
      `DELETE FROM "pokemon" WHERE id = $1 RETURNING id`,
      [req.params.id]
    );
    res.json({
      deleted: true,
      id: result.rows[0].id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

const startServer = async () => {
  try {
      await connectToDb(); // Establish the DB connection
      app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
      });
  } catch (error) {
      console.error('Failed to start the server:', error);
      process.exit(1);
  }
};
startServer();
