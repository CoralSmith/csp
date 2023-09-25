const { explode, condense } = require("./app");
const { questions } = require("./questions.json");

describe("constraints condenser", () => {
  it("condenses duplicate constraints", () => {
    expect(
      condense([
        { num: 1, type: "FT" },
        { num: 1, type: "FT" },
      ])
    ).toEqual([{ num: 2, type: "FT" }]);
  });
  it("condenses two duplicate constraints with different quantities", () => {
    expect(
      condense([
        { num: 1, type: "FT" },
        { num: 2, type: "FT" },
      ])
    ).toEqual([{ num: 3, type: "FT" }]);
  });
  it("condenses a list containing a mix of constraints, including duplicates", () => {
    expect(
      condense([
        { num: 1, type: "FT" },
        { num: 2, type: "FT" },
        { num: 1, type: "MC" },
        { num: 2, type: "MC" },
      ])
    ).toEqual([
      { num: 3, type: "FT" },
      { num: 3, type: "MC" },
    ]);
  });
});

describe("constraints exploder", () => {
  it("returns empty constraints as an empty list of constraints", () => {
    expect(explode([{ must: [] }])).toEqual([{ must: [], sources: 1 }]);
  });

  it("returns simple constraints as an exploded list", () => {
    expect(explode([{ must: [{ num: 1, type: "FT" }] }])).toEqual([{ must: [{ num: 1, type: "FT" }], sources: 1 }]);
  });

  it("returns simple constraints with empty additional as an exploded list", () => {
    expect(explode([{ must: [{ num: 1, type: "FT" }], additional: [] }])).toEqual([
      { must: [{ num: 1, type: "FT" }], sources: 1 },
    ]);
  });

  it("returns condensed constaints into an exploded constraint array", () => {
    expect(
      explode([
        {
          must: [{ num: 1, type: "FT" }],
          additional: [[{ num: 1, type: "FT" }]],
        },
      ])
    ).toEqual([{ must: [{ num: 2, type: "FT" }], sources: 1 }]);
  });

  it("returns complex constraints as a condensed and exploded list", () => {
    const configs = [
      {
        must: [{ num: 1, type: "FT" }],
        additional: [
          [{ num: 1, type: "FT" }],
          [
            { num: 1, type: "MC" },
            { num: 1, type: "FT" },
          ],
        ],
        sources: 1,
      },
      {
        must: [{ num: 3, type: "FT" }],
        sources: 2,
      },
    ];
    const expected = [
      {
        must: [{ num: 2, type: "FT" }],
        sources: 1,
      },
      {
        must: [
          { num: 1, type: "MC" },
          { num: 2, type: "FT" },
        ],
        sources: 1,
      },
      {
        must: [{ num: 3, type: "FT" }],
        sources: 2,
      },
    ];
    const result = explode(configs);
    expect(result).toEqual(expected);
  });

  it("returns long list of complex constraints, condensed then exploded", () => {
    const configs = [];
    configs.push(
      new ConfigBuilder(2)
        .addMust({ num: 1, type: "FT" })
        .addAdditional({ num: 1, type: "FT" })
        .addAdditional([
          { num: 2, type: "MC" },
          { num: 1, type: "RS" },
        ])
        .build()
    );
    configs.push(
      new ConfigBuilder(2)
        .addMust({ num: 1, type: "MC" })
        .addAdditional([
          { num: 2, type: "RC" },
          { num: 1, type: "MC" },
        ])
        .addAdditional({ num: 2, type: "MC" })
        .addAdditional({ num: 1, type: "DI" })
        .build()
    );
    configs.push(
      new ConfigBuilder(1)
        .addMust({ num: 2, type: "FT" })
        .addAdditional({ num: 2, type: "MC" })
        .addAdditional({ num: 2, type: "DI" })
        .addAdditional({ num: 2, type: "FT" })
        .build()
    );
    configs.push(new ConfigBuilder(1).addMust({ num: 2, type: "FT" }).addMust({ num: 1, type: "B" }).build());

    const expected = [];
    expected.push(new ConfigBuilder(2).addMust({ num: 2, type: "FT" }).build());
    expected.push(
      new ConfigBuilder(2)
        .addMust({ num: 2, type: "MC" })
        .addMust({ num: 1, type: "RS" })
        .addMust({ num: 1, type: "FT" })
        .build()
    );
    expected.push(new ConfigBuilder(2).addMust({ num: 2, type: "RC" }).addMust({ num: 2, type: "MC" }).build());
    expected.push(new ConfigBuilder(2).addMust({ num: 3, type: "MC" }).build());
    expected.push(new ConfigBuilder(2).addMust({ num: 1, type: "DI" }).addMust({ num: 1, type: "MC" }).build());
    expected.push(new ConfigBuilder(1).addMust({ num: 2, type: "MC" }).addMust({ num: 2, type: "FT" }).build());
    expected.push(new ConfigBuilder(1).addMust({ num: 2, type: "DI" }).addMust({ num: 2, type: "FT" }).build());
    expected.push(new ConfigBuilder(1).addMust({ num: 4, type: "FT" }).build());
    expected.push(new ConfigBuilder(1).addMust({ num: 2, type: "FT" }).addMust({ num: 1, type: "B" }).build());

    const result = explode(configs);
    console.log(result, expected);
    expect(result).toEqual(expected);
  });
});

describe("constrain and choose a valid question set", () => {
  it("builds a simple result set", () => {
    const config = [new ConfigBuilder(2).addMust({ num: 1, type: "FT" }).addAdditional({ num: 1, type: "FT" }).build()];
    const result = buildValidQuestionSets(config);
  });
});

function buildValidQuestionSets(config) {
  const constraints = explode(config);
  const validSet = [];
  for (constraint of constraints) {
    for (let i = 0; i < must.length(); i++) {
      const poolQuestions = [];
      const questionOptions = questions;
      const sources = new Set();
      const currentQuestionCriteria = must.pop();
      const q = questions.sort(Math.random() - 0.5).find((question) => question.type === currentQuestionCriteria.type);
    }
  }
  return [];
}

class ConfigBuilder {
  constructor(sources = 1) {
    this.sources = sources;
  }
  addMust(obj) {
    if (!this.must) this.must = [];
    if (Array.isArray(obj)) {
      this.must.push(...obj);
    } else {
      this.must.push(obj);
    }
    return this;
  }
  addAdditional(obj) {
    if (!this.additional) this.additional = [];
    this.additional.push(Array.isArray(obj) ? obj : [obj]);
    return this;
  }
  setSources(num) {
    this.sources = num;
    return this;
  }
  build() {
    let result = { sources: this.sources };
    if (this.additional) result.additional = this.additional;
    if (this.must) result.must = this.must;
    return { ...this };
  }
}
