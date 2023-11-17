const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

const getPagination = (query) => {
  const limit = Math.abs(query.limit) || 1;
  const page = Math.abs(query.page) || DEFAULT_PAGE_LIMIT;
  const skip = limit * (page - 1);

  return {
    skip,
    limit,
  };
};

module.exports = {
  getPagination,
};
