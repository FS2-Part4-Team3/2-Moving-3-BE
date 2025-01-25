async function getRandomRecord(model: any) {
  const count = await model.count();
  const skip = Math.floor(Math.random() * count);

  const [record] = await model.findMany({ skip, take: 1 });

  return record;
}

export default getRandomRecord;
