import '../lib/string';

test('string', () => {
  expect("apple".upperCamelCase()).toEqual("Apple");
  expect("aaa bbb ccc".camelCase()).toEqual("aaaBbbCcc");
  expect("amazon/amazon-ecs-sample".replace("/", " ").replace("-", " ").upperCamelCase()).toEqual("AmazonAmazonEcsSample");
});
