// Allow 404 page to actually give an error
exports.handler = async (event, context) => {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Page not found",
        location: event.path
      }),
    };
  };
  