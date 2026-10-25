module.exports = engine => engine.registerTag('doc', {
  parse(_token, tokens) {
    const stream = this.liquid.parser.parseStream(tokens);
    stream.on('tag:enddoc', () => stream.stop());
    stream.start();
  },
  render() { return ''; }
});
