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

exports.makeRefObj = list => {
  const articleObjRef = {};

  list.forEach(article => {
    const { id, title } = article;
    articleObjRef[title] = id;
  });

  return articleObjRef;
};

exports.formatComments = (comments, articleRef) => {
  const newCommentArr = comments.map(comment => {
    const newTimestamp = new Date(comment.created_at);
    const { body, votes, created_at, belongs_to } = comment;
    const article_id = articleRef[belongs_to];

    const newComment = {
      article_id,
      author: comment.created_by,
      body,
      votes,
      created_at
    };
    newComment.created_at = newTimestamp;

    return newComment;
  });
  return newCommentArr;
};
