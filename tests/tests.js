describe('Binding', function() {
  afterEach(keyster.clean);

  it('Single key selectors.', function() {
    var a = false;

    console.log('Single key selectors.');
    keyster('a', function() {
      a = true;
    });

    keyster('a');
    a.should.equal(true);
  });

  it('Simple Key Sequences.', function() {
    var ab = false;

    console.log('Simple Key Sequences.');
    keyster('a > b', function() {
      ab = true;
    });

    keyster('a');
    ab.should.equal(false);

    keyster('b');
    ab.should.equal(true);
  });

  it('Key Sequence Timeout.', function(done) {
    var ab = false;

    console.log('Key Sequence Timeout.');
    keyster('a > b', function() {
      ab = true;
    });

    keyster('a');
    ab.should.equal(false);

    var timeout = setTimeout(function() {
      keyster('b');
      ab.should.equal(false);
      done();
    }, keyster.timeout);
  });

  it('Key combinations.', function() {
    var ab = false;

    console.log('Key combinations.');
    keyster('a + b', function() {
      ab = true;
    });

    keyster('a + b');
    ab.should.equal(true);
  });

  it('Single, combination and sequence.', function() {
    var abcde;

    console.log('Single, combination and sequence.');
    keyster('a, b > c, d + e', function() {
      abcde = true;
    });

    abcde = false;
    keyster('a');
    abcde.should.equal(true);

    abcde = false;
    keyster('b > c');
    abcde.should.equal(true);

    abcde = false;
    keyster('d + e');
    abcde.should.equal(true);
  });

  it('Complex Selectors.', function() {
    var pass = false;

    console.log('Complex Selectors.');
    keyster('a > a + b > b > b + c > d', function() {
      pass = true;
    });

    keyster('a');
    pass.should.equal(false);

    keyster('a + b');
    pass.should.equal(false);

    keyster('b');
    pass.should.equal(false);

    keyster('b + c');
    pass.should.equal(false);

    keyster('d');
    pass.should.equal(true);
  });

  it('Extra keys in a sequence do not affect the match.', function() {
    var pass = false;

    keyster('a > b', function() {
      pass = true;
    });

    keyster('a');
    keyster('b');
    keyster('c');
    pass.should.equal(true);
  });
});