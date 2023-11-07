const CatchResponse = ({
    res,
    err
}) => {
  let statusCode = 500;
  let error = 'Server Error';

  if (err.statusCode) {
    ({ statusCode } = err);
  }

  if (err.error) {
    ({ error } = err);
  }

  if (err.message) {
    error = err.message;
  }
  console.log('in catch response object', err.message);

  return res.status(statusCode).json({
    success: false,
    error
  });
};

export default CatchResponse;
