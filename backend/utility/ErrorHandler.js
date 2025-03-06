
class ThrowError extends Error {
  constructor(status,message,error){
    super(message);
    this.status = status;
    this.error = error;
    Error.captureStackTrace(this,this.constructor)
  }
}

export default ThrowError