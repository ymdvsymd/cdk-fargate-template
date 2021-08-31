import '../lib/string';

test('string#camelCase', () => {
  expect("aaa bbb ccc".camelCase()).toEqual("aaaBbbCcc");
});

test('string#upperCamelCase', () => {
  expect("apple".upperCamelCase()).toEqual("Apple");
  expect("amazon/amazon-ecs-sample".replace("/", " ").replace("-", " ").upperCamelCase()).toEqual("AmazonAmazonEcsSample");
});
