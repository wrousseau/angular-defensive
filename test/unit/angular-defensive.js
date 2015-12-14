import angularDefensive from '../../src/angular-defensive';

describe('angularDefensive', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(angularDefensive, 'greet');
      angularDefensive.greet();
    });

    it('should have been run once', () => {
      expect(angularDefensive.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(angularDefensive.greet).to.have.always.returned('hello');
    });
  });
});
