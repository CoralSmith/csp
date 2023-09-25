function explode(configs) {
  const result = [];
  if (configs.length === 0) return result;
  for (opt of configs) {
    if (!opt.additional || opt.additional.length === 0) {
      delete opt.additional;
      result.push({ sources: 1, ...opt });
    } else {
      result.push(
        ...opt.additional?.map((item) => {
          return {
            must: condense([...item, ...opt.must]),
            sources: opt.sources ?? 1,
          };
        })
      );
    }
  }

  return result;
}

function condense(configElements) {
  const typeConstraints = new Set(configElements.map((c) => c.type));
  const constraints = [];
  for (type of typeConstraints) {
    num = configElements
      .filter((c) => c.type === type)
      .map((c) => c.num)
      .reduce((i, j) => i + j);
    constraints.push({ num, type });
  }
  return constraints;
}

module.exports = { explode, condense };
