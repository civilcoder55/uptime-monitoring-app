import { FilterQuery, Model } from "mongoose";

export async function paginator(model: Model<any>, page: string, filter: FilterQuery<any>) {
  let pageNum = parseInt(page) || 1;
  if (pageNum < 0) pageNum = 1;

  const limit = 10;

  const totalRecords = await model.countDocuments(filter);
  const totalPages = Math.ceil(totalRecords / limit);
  const hasOther = totalPages > 1;
  const hasNext = !!(pageNum < totalPages && hasOther);
  const hasPerv = !!(pageNum > 1 && hasOther);

  const offset = (pageNum - 1) * limit;

  const records = await model.find(filter).sort('-createdAt').skip(offset).limit(10);

  return { records, pagination: { totalPages, hasNext, hasPerv, pageNum, totalRecords } };
}
