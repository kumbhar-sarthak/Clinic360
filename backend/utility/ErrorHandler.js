
class ThrowError extends Error {
  constructor(status,message,error,stack=""){
    super(message);
    this.status = status;
    this.error = error;
    if(stack) this.stack = stack
    else Error.captureStackTrace(this,this.constructor)
  }
}

export default ThrowError