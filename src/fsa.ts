export interface FSA<Elements> {
    type: keyof Elements;
    payload: Elements[keyof Elements];
}
