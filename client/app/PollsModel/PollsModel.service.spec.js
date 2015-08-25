'use strict';

describe('Service: PollsModel', function () {

  // load the service's module
  beforeEach(module('workspaceApp'));

  // instantiate service
  var PollsModel;
  beforeEach(inject(function (_PollsModel_) {
    PollsModel = _PollsModel_;
  }));

  it('should do something', function () {
    expect(!!PollsModel).toBe(true);
  });

});
