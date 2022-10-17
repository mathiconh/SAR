import http from "../http-common";
import { validatePayload } from '../utils/payloadValidations';

class InscripcionDataService {
  async getAvailable() {
    const result = await http.get(`availableRaces`);
    console.log('DB Result: ', result);
    return result;
  }

  async createInscripcion({carreraId, claseId, dni, pagarMP, vehiculoSeleccionado}) {
    console.log("About inscribir: ", carreraId, claseId, dni, pagarMP, vehiculoSeleccionado);
    let result;

    result = validatePayload({ carreraId, claseId, dni, vehiculoSeleccionado });
    if (!result.status) return result;

    result = await http.post(`/createInscripcion?carreraId=${carreraId}&claseId=${claseId}&dni=${dni}&pagarMP=${pagarMP}&vehiculoId=${vehiculoSeleccionado}`);
    console.log('Result: ', result);
    return result;
  }

}

export default new InscripcionDataService();