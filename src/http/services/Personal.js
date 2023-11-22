
import axios from '@/http/connection/axios';

class Personal {
    constructor(sucursal, personal) {
        this.prefix = "/personal";
        this.sucursal = sucursal;
        this.personal = {
            id: 0,
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            cargo: "",
            ci: "",
            ci_expedido: "",
            n_contacto: "",
            direccion: "",
            email: "",
            foto: null,
        }
        if (personal != undefined) {
            this.setAttributes(personal);
        }
        this.config = {
            headers: {
                'Assept': 'Application/json',
                'Content-Type': 'multipart/form-data'
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

    setAttributes(personal) {
        Object.entries(this.personal).forEach(([key]) => {
            if (Object.prototype.hasOwnProperty.call(personal, key)) {
                this.personal[key] = personal[key];
            }
        });
    }
    getAttributes() {
        return this.personal;
    }

    async store() {
        try {
            const resolve = await axios.post(this.prefix + "/new", {
                ...this.getAttributes(),
                sucursal: this.sucursal,
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }

    }//store


    async update() {
        try {
            // verificados si se subio una nueva foto
            //si foto sigue de tipo string significa que sigue contiene el nombre de la foto
            //lo colocamos null para que el servidor acepte
            //ya que las validaciones solo aseptan imagenes y no string
            if (typeof this.getAttributes().foto == "string") {
                this.setAttributes({ foto: null });
            }
            this.config.headers['X-HTTP-Method-Override'] = 'PUT';
            const resolve = await axios.post(this.prefix + "/refresh", {
                ...this.getAttributes(),
                sucursal: this.sucursal,
            }, this.config);
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
    async byCiPersonal() {
        try {
            const resolve = await axios.post(this.prefix + "/by-ci-personal", {
                ci: this.getAttributes().ci,
                sucursal: this.sucursal
            }, this.config);
            return resolve.data;
        } catch (error) {
            return error.response.data;
        }
    }


}//class

export default Personal;