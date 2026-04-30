export const successResponse = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

export const errorResponse = (res, message = 'Error', statusCode = 500) =>
  res.status(statusCode).json({ success: false, message });

export const paginatedResponse = (res, data, total, page, limit) =>
  res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page:       parseInt(page),
      limit:      parseInt(limit),
      totalPages: Math.ceil(total / limit),
      hasNext:    page * limit < total,
      hasPrev:    page > 1,
    },
  });
