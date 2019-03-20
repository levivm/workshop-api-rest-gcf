/* src/routes.ts */
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);


export class Routes {

    public app: any;
    public db: any;

    constructor(app){
        this.app = app;
        this.db = admin.firestore();
    }

    appRoutes(){

        // Warmup endpoint
        this.app.get('/warmup', (request, response) => {

            response.send('Calentando para la pelea');

        });

        this.app.post('/fights', async (request, response) => {
          try {
            const { winner, losser, title } = request.body;
            const data = {
              winner,
              losser,
              title
            } 
            const fightRef = await this.db.collection('fights').add(data);
            const fight = await fightRef.get();

            response.json({
              id: fightRef.id,
              data: fight.data()
            });

          } catch(error){

            response.status(500).send(error);

          }
          
        
        
        });

        // Get fight endpoint by Id
        this.app.get('/fights/:id', async (request, response) => {
          try {
            const fightId = request.params.id;

            if (!fightId) throw new Error('Fight ID is required');

            const fight = await this.db.collection('fights').doc(fightId).get();

            if (!fight.exists){
                throw new Error('Fight doesnt exist.')
            }

            response.json({
              id: fight.id,
              data: fight.data()
            });

          } catch(error){

            response.status(500).send(error);

          }
          
        });

        // Get all fights
        this.app.get('/fights', async (request, response) => {
          try {

            const fightQuerySnapshot = await this.db.collection('fights').get();
            const fights = [];
            fightQuerySnapshot.forEach(
                (doc) => {
                    fights.push({
                        id: doc.id,
                        data: doc.data()
                    });
                }
            );

            response.json(fights);

          } catch(error){

            response.status(500).send(error);

          }
          
        });


        // Update a fight by Id
        this.app.put('/fights/:id', async (request, response) => {
          try {

            const fightId = request.params.id;
            const title = request.body.title;

            if (!fightId) throw new Error('id is blank');

            if (!title) throw new Error('Title is required');

            const data = { 
                title
            };
            const fightRef = await this.db.collection('fights')
                .doc(fightId)
                .set(data, { merge: true });

            response.json({
                id: fightId,
                data
            })


          } catch(error){

            response.status(500).send(error);

          }
          
        });


        // Delete fight by Id
        this.app.delete('/fights/:id', async (request, response) => {
          try {

            const fightId = request.params.id;

            if (!fightId) throw new Error('id is blank');

            await this.db.collection('fights')
                .doc(fightId)
                .delete();

            response.json({
                id: fightId,
            })


          } catch(error){

            response.status(500).send(error);

          }
          
        });


    }

}
