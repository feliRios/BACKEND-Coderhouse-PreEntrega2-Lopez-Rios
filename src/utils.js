// __DIRNAME
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


// EXCEPCIONES PERSONALIZADAS
class NotFoundError extends Error {
  // Excepcion para elementos inexistentes
  constructor(message){
    super(message);
    this.name = "NotFoundError";
  }
}

class LimitError extends Error {
  // Excepcion para errores en el ingreso de limites
  constructor(message){
    super(message);
    this.name = "LimitError";
  }
}

class AlreadyExistsError extends Error {
  // Excepcion para elementos existentes
  constructor(message){
    super(message);
    this.name = "AlreadyExistsError";
  }
}

export { __dirname, NotFoundError, LimitError, AlreadyExistsError };