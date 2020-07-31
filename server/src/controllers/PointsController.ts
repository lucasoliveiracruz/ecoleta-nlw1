import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.id_point")
      .whereIn("point_items.id_item", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

      console.log(points);

    return response.json(points);
  }
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("points").select("*").where("id", id).first();

    if (!point) {
      return response
        .status(400)
        .json({ status: 404, message: "Point not found" });
    }

    //retornar itens relacionados ao ponto de coleta
    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.id_item")
      .where("point_items.id_point", point.id)
      .select("items.title");

    response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80",
    };

    const insertedIds = await trx("points").insert(point);
    const id_point = insertedIds[0];

    const pointItems = items.map((id_item: number) => {
      return {
        id_point,
        id_item,
      };
    });

    await trx("point_items").insert(pointItems);
    await trx.commit();

    return response.json({ id: id_point, ...point });
  }
}

export default PointsController;
