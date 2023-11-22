
import axios from '@/http/connection/axios';

class Cliente {
    constructor(sucursal, cliente) {
        this.prefix = "/cliente";
        this.sucursal = sucursal;
        this.cliente = {
            id: 0,
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            n_contacto: "",
            email: "",
        }
        if (cliente != undefined) {
            this.setAttributes(cliente);
        }
        this.config = {
            headers: {
                'Assept': 'Application/json',
                'Content-Type': 'Application/json'
            }

        }

    }

    async index() {
        try {
            const resolve = await axios.post(this.prefix + "/all", {
                sucursal: this.sucursal
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//index

    setAttributes(cliente) {
        Object.entries(this.cliente).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(cliente, key)) {
                this.cliente[key] = cliente[key];
            }
        });
    }
    getAttributes() {
        return this.cliente;
    }

    async store() {
        try {
            const resolve = await axios.post(this.prefix + "/new", {
                ...this.getAttributes(),
                sucursal: this.sucursal
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//store


    async update() {
        try {
            this.config.headers['X-HTTP-Method-Override'] = 'PUT';
            const resolve = await axios.post(this.prefix + "/refresh", this.getAttributes(), this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//update


    async destroy() {
        try {
            const resolve = await axios.post(this.prefix + "/delete", {
                id: this.getAttributes().id
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//index

    async importRecords(is_archivo_xlsx) {
        try {
            const resolve = await axios.post(this.prefix + "/carga-masiva", {
                archivo_xlsx: is_archivo_xlsx,
                sucursal: this.sucursal
            }, {
                headers: {
                    'Assept': 'Application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }
}//class

export default Cliente;