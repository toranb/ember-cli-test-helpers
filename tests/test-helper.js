import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import testDone from "ember-cli-test-helpers/tests/helpers/fauxjax-testdone";
import QUnit from "qunit";

setResolver(resolver);

QUnit.testDone(testDone);
