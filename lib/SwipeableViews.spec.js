'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _chai = require('chai');

var _sinon = require('sinon');

var _SwipeableViews = require('./SwipeableViews');

var _SwipeableViews2 = _interopRequireDefault(_SwipeableViews);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function simulateSwipeMove(wrapper, event) {
  return wrapper.instance().handleSwipeMove((0, _extends3.default)({
    preventDefault: function preventDefault() {}
  }, event));
} /* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-env mocha */

describe('SwipeableViews', function () {
  describe('prop: children', function () {
    it('should render the children', function () {
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        null,
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°2'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°3'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°4'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°5'
        )
      ));

      _chai.assert.strictEqual(wrapper.text(), 'slide n°1slide n°2slide n°3slide n°4slide n°5', 'Should render each slide.');
    });
  });

  describe('prop: hysteresis', function () {
    function createWrapper(hysteresis) {
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        { hysteresis: hysteresis },
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°2'
        )
      ));

      wrapper.simulate('touchStart', {
        touches: [{
          pageX: 155,
          pageY: 50
        }]
      });
      simulateSwipeMove(wrapper, {
        touches: [{
          pageX: 150,
          pageY: 50
        }]
      });
      var instance = wrapper.instance();
      instance.viewLength = 200;
      return wrapper;
    }

    it('should not change slide when swipe was not enough', function () {
      var wrapper = createWrapper();

      simulateSwipeMove(wrapper, {
        touches: [{
          pageX: 80,
          pageY: 50
        }]
      });
      wrapper.instance().vx = 0;
      wrapper.simulate('touchEnd');
      _chai.assert.equal(wrapper.state().indexCurrent, 0);
    });

    it('should change slide after long swipe', function () {
      var wrapper = createWrapper();

      simulateSwipeMove(wrapper, {
        touches: [{
          pageX: 20,
          pageY: 50
        }]
      });

      wrapper.instance().vx = 0;
      wrapper.simulate('touchEnd');
      _chai.assert.equal(wrapper.state().indexCurrent, 1);
    });

    it('should change slider hysteresis via prop', function () {
      var wrapper = createWrapper(0.3);

      simulateSwipeMove(wrapper, {
        touches: [{
          pageX: 80,
          pageY: 50
        }]
      });

      wrapper.instance().vx = 0;
      wrapper.simulate('touchEnd');
      _chai.assert.equal(wrapper.state().indexCurrent, 1);
    });
  });

  describe('prop: onTouchStart', function () {
    it('should trigger when we bind it', function () {
      var handleTouchStart = (0, _sinon.spy)();
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        { onTouchStart: handleTouchStart },
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        )
      ));

      wrapper.simulate('touchStart', {
        touches: [{}]
      });
      _chai.assert.strictEqual(handleTouchStart.callCount, 1, 'Should be called');
    });

    it('should trigger when we disable the swipe', function () {
      var handleTouchStart = (0, _sinon.spy)();
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        { disabled: true, onTouchStart: handleTouchStart },
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        )
      ));

      wrapper.simulate('touchStart', {
        touches: [{}]
      });
      _chai.assert.strictEqual(handleTouchStart.callCount, 1, 'Should be called');
    });
  });

  describe('prop: onTouchEnd', function () {
    it('should trigger when we bind it', function () {
      var handleTouchEnd = (0, _sinon.spy)();
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        { onTouchEnd: handleTouchEnd },
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        )
      ));

      wrapper.simulate('touchEnd');
      _chai.assert.strictEqual(handleTouchEnd.callCount, 1, 'Should be called');
    });
  });

  describe('prop: animateTransitions', function () {
    it('should use a spring if animateTransitions is true', function () {
      var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(
        _SwipeableViews2.default,
        null,
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        )
      ));

      _chai.assert.include(wrapper.childAt(0).props().style, {
        WebkitFlexDirection: 'row',
        WebkitTransform: 'translate(0%, 0)',
        WebkitTransition: '-webkit-transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s',
        transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
      });
    });

    it('should not use a spring if animateTransitions is false', function () {
      var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(
        _SwipeableViews2.default,
        { animateTransitions: false },
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        )
      ));

      _chai.assert.include(wrapper.childAt(0).props().style, {
        transition: 'all 0s ease 0s'
      });
    });
  });

  describe('swipe detection', function () {
    var instance = void 0;
    var wrapper = void 0;

    beforeEach(function () {
      wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        null,
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°2'
        )
      ));

      wrapper.simulate('touchStart', {
        touches: [{
          pageX: 50,
          pageY: 50
        }]
      });
      instance = wrapper.instance();
      instance.viewLength = 200;
    });

    it('should not detect a swipe when scrolling', function () {
      simulateSwipeMove(wrapper, {
        touches: [{
          pageX: 50,
          pageY: 60
        }]
      });
      _chai.assert.strictEqual(instance.isSwiping, false, 'Should not detect a swipe');
    });

    it('should detect a swipe when doing a clear movement', function () {
      simulateSwipeMove(wrapper, {
        touches: [{
          pageX: 60,
          pageY: 50
        }]
      });
      _chai.assert.strictEqual(instance.isSwiping, true, 'Should detect a swipe');
    });

    it('should wait for a clear movement to detect a swipe', function () {
      simulateSwipeMove(wrapper, {
        touches: [{
          pageX: 48,
          pageY: 50
        }]
      });
      _chai.assert.strictEqual(instance.isSwiping, undefined, 'We do not know yet');

      simulateSwipeMove(wrapper, {
        touches: [{
          pageX: 50,
          pageY: 48
        }]
      });
      _chai.assert.strictEqual(instance.isSwiping, undefined, 'We do not know yet');

      simulateSwipeMove(wrapper, {
        touches: [{
          pageX: 40,
          pageY: 50
        }]
      });
      _chai.assert.strictEqual(instance.isSwiping, true, 'Should detect a swipe');
    });
  });

  describe('nested views', function () {
    var wrapperParent = void 0;
    var wrapperNester = void 0;

    beforeEach(function () {
      wrapperParent = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        { index: 1 },
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°2'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°3'
        )
      ));

      wrapperNester = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        { index: 0 },
        _react2.default.createElement(
          'div',
          null,
          'slide n°4'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°5'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°6'
        )
      ));

      var touchStartEvent = {
        touches: [{
          pageX: 50,
          pageY: 0
        }]
      };

      wrapperNester.simulate('touchStart', touchStartEvent);
      wrapperParent.simulate('touchStart', touchStartEvent);

      var instance1 = wrapperParent.instance();
      instance1.viewLength = 200;
      instance1.startIndex = 1;

      var instance2 = wrapperNester.instance();
      instance2.viewLength = 200;
    });

    afterEach(function () {
      wrapperNester.simulate('touchEnd');
      wrapperParent.simulate('touchEnd');
    });

    it('only the nested swipe should respond to the touch', function () {
      var touchMoveEvent1 = {
        touches: [{
          pageX: 45,
          pageY: 0
        }]
      };

      simulateSwipeMove(wrapperNester, touchMoveEvent1);
      simulateSwipeMove(wrapperParent, touchMoveEvent1);

      var touchMoveEvent2 = {
        touches: [{
          pageX: 40,
          pageY: 0
        }]
      };

      simulateSwipeMove(wrapperNester, touchMoveEvent2);
      simulateSwipeMove(wrapperParent, touchMoveEvent2);

      _chai.assert.strictEqual(wrapperNester.state().indexCurrent, 0.025);
      _chai.assert.strictEqual(wrapperParent.state().indexCurrent, 1);
    });

    it('only the parent swipe should respond to the touch', function () {
      var touchMoveEvent1 = {
        touches: [{
          pageX: 55,
          pageY: 0
        }]
      };

      simulateSwipeMove(wrapperNester, touchMoveEvent1);
      simulateSwipeMove(wrapperParent, touchMoveEvent1);

      var touchMoveEvent2 = {
        touches: [{
          pageX: 60,
          pageY: 0
        }]
      };

      simulateSwipeMove(wrapperNester, touchMoveEvent2);
      simulateSwipeMove(wrapperParent, touchMoveEvent2);

      _chai.assert.strictEqual(wrapperNester.state().indexCurrent, 0);
      _chai.assert.strictEqual(wrapperParent.state().indexCurrent, 0.975);
    });
  });

  describe('prop: index', function () {
    it('should only update the state when the index change', function () {
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        null,
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°2'
        )
      ));
      _chai.assert.strictEqual(wrapper.state().indexCurrent, 0, 'should start at the begining');

      wrapper.setProps({
        index: 1
      });
      _chai.assert.strictEqual(wrapper.state().indexCurrent, 1, 'should update the state');

      wrapper.setState({
        indexCurrent: 0
      });
      wrapper.setProps({
        index: 1
      });
      _chai.assert.strictEqual(wrapper.state().indexCurrent, 0, 'should keep the same state');
    });
  });

  describe('prop: onTransitionEnd', function (done) {
    it('should be called once the transition comes to a rest.', function () {
      var handleTranstionEnd = (0, _sinon.spy)();
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        { index: 1, onTransitionEnd: handleTranstionEnd },
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°2'
        )
      ));

      wrapper.setProps({
        index: 2
      });

      setTimeout(function () {
        _chai.assert.strictEqual(handleTranstionEnd.callCount, 1, 'should comes to a rest once');
        done();
      }, 0);
    });
  });

  describe('findNativeHandler', function () {
    it('should work in a simple case', function () {
      var hasFoundNativeHandler = (0, _SwipeableViews.findNativeHandler)({
        domTreeShapes: [{
          scrollLeft: 0,
          scrollWidth: 200,
          clientWidth: 100
        }],
        indexCurrent: 1,
        index: 1.1,
        axis: 'x'
      });

      _chai.assert.strictEqual(hasFoundNativeHandler, true);
    });

    it('should work with different axis', function () {
      var hasFoundNativeHandler = (0, _SwipeableViews.findNativeHandler)({
        domTreeShapes: [{
          scrollTop: 0,
          scrollHeight: 100,
          clientHeight: 100
        }],
        indexCurrent: 1,
        index: 1.1,
        axis: 'y'
      });

      _chai.assert.strictEqual(hasFoundNativeHandler, false);
    });
  });

  describe('getDomTreeShapes', function () {
    beforeEach(function () {
      (0, _sinon.stub)(window, 'getComputedStyle').returns({
        getPropertyValue: function getPropertyValue() {
          return '';
        }
      });
    });

    afterEach(function () {
      window.getComputedStyle.restore();
    });

    it('should stop at the data-swipeable attribute', function () {
      var rootNode = {};

      var optionNode = {
        hasAttribute: function hasAttribute() {
          return true;
        },
        parentNode: rootNode
      };

      var targetNode = {
        hasAttribute: function hasAttribute() {
          return false;
        },
        parentNode: optionNode,
        clientWidth: 10,
        scrollWidth: 20,
        style: {}
      };

      var domTreeShapes = (0, _SwipeableViews.getDomTreeShapes)(targetNode, optionNode);

      _chai.assert.strictEqual(domTreeShapes.length, 1);
      _chai.assert.strictEqual(domTreeShapes[0].clientWidth, 10);
    });
  });

  describe('prop: slideClassName', function () {
    it('should apply a className prop to every rendered slide component', function () {
      var Slide = function Slide() {
        return _react2.default.createElement('div', null);
      };
      var classNameToApply = 'someclassname';
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _SwipeableViews2.default,
        { slideClassName: classNameToApply },
        _react2.default.createElement(Slide, null),
        _react2.default.createElement(Slide, null)
      ));

      _chai.assert.strictEqual(wrapper.find(Slide).everyWhere(function (slide) {
        return slide.parent().prop('className') === classNameToApply;
      }), true, 'should apply the className prop');
    });
  });

  describe('tabs', function () {
    it('should reset the scroll position and call onChangeIndex', function () {
      var handleScroll = (0, _sinon.spy)();
      var handleChangeIndex = (0, _sinon.spy)();
      var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(
        _SwipeableViews2.default,
        {
          index: 1,
          onScroll: handleScroll,
          onChangeIndex: handleChangeIndex
        },
        _react2.default.createElement(
          'div',
          null,
          'slide n°1'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°2'
        ),
        _react2.default.createElement(
          'div',
          null,
          'slide n°3'
        )
      ));

      var rootNode = {
        scrollLeft: 80,
        clientWidth: 100
      };
      wrapper.instance().rootNode = rootNode;
      wrapper.instance().handleScroll({
        target: rootNode
      });
      _chai.assert.strictEqual(handleScroll.callCount, 1, 'should forward the event');
      _chai.assert.strictEqual(rootNode.scrollLeft, 0, 'should reset the scroll position');
      _chai.assert.strictEqual(handleChangeIndex.callCount, 1, 'should detect a new index');
      _chai.assert.deepEqual(handleChangeIndex.args[0], [2, 1]);
    });
  });
});