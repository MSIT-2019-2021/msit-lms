import React from "react";
import { shallow } from "enzyme";
import ProgramCatalog from "./program-catalog";

describe("ProgramCatalog", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<ProgramCatalog />);
    expect(wrapper).toMatchSnapshot();
  });
});
