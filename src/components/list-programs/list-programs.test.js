import React from 'react'
import { shallow } from "enzyme"
import ListPrograms from './list-programs'

describe("ListPrograms", () => {
    test("matches snapshot", () => {
        const wrapper= shallow(<ListPrograms />);
        expect(wrapper).toMatchSnapshot();
    });
});