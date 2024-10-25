import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { Carpark, CarParkType, ParkingSystemType, sequelize } from '../models/index.js';

export async function loadCarparkData(filePath) {
  const transaction = await sequelize.transaction();
  const batchSize = 100;
  const carparksBatch = [];

  try {
    const parser = createReadStream(filePath).pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

    for await (const record of parser) {
      const [carParkType] = await CarParkType.findOrCreate({
        where: { name: record.car_park_type },
        transaction
      });

      const [parkingSystemType] = await ParkingSystemType.findOrCreate({
        where: { name: record.type_of_parking_system },
        transaction
      });

      carparksBatch.push({
        car_park_no: record.car_park_no,
        address: record.address,
        x_coord: parseFloat(record.x_coord),
        y_coord: parseFloat(record.y_coord),
        short_term_parking: record.short_term_parking,
        free_parking: record.free_parking,
        night_parking: record.night_parking.toUpperCase() === 'YES',
        car_park_decks: parseInt(record.car_park_decks),
        gantry_height: parseFloat(record.gantry_height),
        car_park_basement: record.car_park_basement.toUpperCase() === 'YES',
        carParkTypeId: carParkType.id,
        parkingSystemTypeId: parkingSystemType.id
      });

      if (carparksBatch.length >= batchSize) {
        await Carpark.bulkCreate(carparksBatch, { 
          transaction,
          updateOnDuplicate: Object.keys(Carpark.getAttributes())
        });
        carparksBatch.length = 0;
      }
    }

    if (carparksBatch.length > 0) {
      await Carpark.bulkCreate(carparksBatch, {
        transaction, 
        updateOnDuplicate: Object.keys(Carpark.getAttributes())
      });
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    throw error;
  }
}
