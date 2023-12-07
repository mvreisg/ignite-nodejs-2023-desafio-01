export class Database {
    #database = {}

    create(table, object) {
        this.#persist(table);
        this.#database[table].push(object);
    }

    select(table){
        this.#persist(table);
        return this.#database[table];
    }

    update(table, id, object){
        this.#persist(table);
        let rowIndex = -1;
        Object.entries(this.#database[table]).forEach((entry, index) => {            
            if (entry[1].id === id){                
                rowIndex = index;
            }            
        });
        const old = this.#database[table][rowIndex];
        const { title, description } = object;

        this.#database[table][rowIndex] = {
            id,
            title,
            description,
            completed_at: null,
            created_at: old.created_at,
            updated_at: new Date(Date.now()),
        };
    }

    delete(table, id){
        this.#persist(table);
        let rowIndex = -1;
        Object.entries(this.#database[table]).forEach((entry, index) => {            
            if (entry[1].id === id){
                rowIndex = index;
            }            
        });

        this.#database[table].splice(rowIndex, 1);
    }

    complete(table, id){
        this.#persist(table);
        let rowIndex = -1;
        Object.entries(this.#database[table]).forEach((entry, index) => {            
            if (entry[1].id === id){
                rowIndex = index;
            }            
        });
        const old = this.#database[table][rowIndex];

        this.#database[table][rowIndex] = {
            id: old.id,
            title: old.title,
            description: old.description,
            completed_at: new Date(Date.now()),
            created_at: old.created_at,
            updated_at: new Date(Date.now()),
        };
    }

    #persist(table){
        if (!this.#database[table]){
            this.#database[table] = [];
        }
    }
}