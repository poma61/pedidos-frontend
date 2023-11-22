
import axios from '@/http/connection/axios';

class Sucursal {
    constructor(sucursal) {
        this.prefix = "/sucursal";
        this.sucursal = {
            id: "",
            nombres: "",
            direccion: "",
            n_contacto: "",
        };
        if (sucursal != undefined) {
            this.setAttributes(sucursal);
        }
        this.config = {
            headers: {
                'Assept': 'Application/json',
                'Content-Type': 'Application/json',
            }
        }
    }

    async index() {
        try {
            const resolve = await axios.post(this.prefix + "/all");
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//index

    setAttributes(sucursal) {
        Object.entries(this.sucursal).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(sucursal, key)) {
                this.sucursal[key] = sucursal[key];
            }
        });
    }
    getAttributes() {
        return this.sucursal;
    }

    async store() {
        try {
            const resolve = await axios.post(this.prefix + "/new", this.getAttributes(), this.config);

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

    }//destroy


}//class

export default Sucursal;