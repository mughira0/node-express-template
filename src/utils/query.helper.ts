// utils/queryHelper.ts
import { FilterQuery, Model, Document } from "mongoose";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  searchFields?: string[];
}

export async function paginateAndSearch<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T> = {},
  options: PaginationOptions = {},
) {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 10;
  const skip = (page - 1) * limit;

  let query = model.find(filter);

  if (options.search && options.searchFields?.length) {
    const searchRegex = new RegExp(options.search, "i");
    query = query.find({
      $or: options.searchFields.map((field) => ({ [field]: searchRegex })),
    });
  }

  const totalCount = await model.countDocuments(query.getFilter());

  // Sort
  if (options.sortBy) {
    const sortOrder = options.sortOrder === "desc" ? -1 : 1;
    query = query.sort({ [options.sortBy]: sortOrder });
  }

  // Pagination
  const results = await query.skip(skip).limit(limit);

  return {
    results,
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}
