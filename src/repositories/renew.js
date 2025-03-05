const Renew = require("../models/renew");

class RenewRepository {
    async createRenew(filtros) {
        try {
            await Renew.create(filtros);
        } catch (error) {
            console.error("Erro ao criar Renew:", error);
            throw new Error(error);
        }
    }

    async findRenew(filtros) {
        try {
           return await Renew.findAll({
                where: filtros,
            });
        } catch (error) {
            console.error("Erro ao buscar Renew:", error);
            throw new Error(error);
        }
    }
}

module.exports = new RenewRepository();