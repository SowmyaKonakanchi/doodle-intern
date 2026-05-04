const paginate = async (model, query, req) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 5;

  let skip = (page - 1) * limit;

  const data = await model.find(query)
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  const total = await model.countDocuments(query);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    data,
  };
};

module.exports = paginate;
