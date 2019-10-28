exports.formatDates = list => {
  const dataArr = list.map(item => {
    const newTimestamp = new Date(item.created_at);
    const newObj = {
      ...item
    };
    newObj.created_at = newTimestamp;

    return newObj;
  });
  return dataArr;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
