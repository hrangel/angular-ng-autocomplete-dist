/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ContentChild, ElementRef, EventEmitter, forwardRef, Input, Output, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
/** *
 * Keyboard events
  @type {?} */
var isArrowUp = function (keyCode) { return keyCode === 38; };
var ɵ0 = isArrowUp;
/** @type {?} */
var isArrowDown = function (keyCode) { return keyCode === 40; };
var ɵ1 = isArrowDown;
/** @type {?} */
var isArrowUpDown = function (keyCode) { return isArrowUp(keyCode) || isArrowDown(keyCode); };
var ɵ2 = isArrowUpDown;
/** @type {?} */
var isEnter = function (keyCode) { return keyCode === 13; };
var ɵ3 = isEnter;
/** @type {?} */
var isBackspace = function (keyCode) { return keyCode === 8; };
var ɵ4 = isBackspace;
/** @type {?} */
var isDelete = function (keyCode) { return keyCode === 46; };
var ɵ5 = isDelete;
/** @type {?} */
var isESC = function (keyCode) { return keyCode === 27; };
var ɵ6 = isESC;
/** @type {?} */
var isTab = function (keyCode) { return keyCode === 9; };
var ɵ7 = isTab;
var AutocompleteComponent = /** @class */ (function () {
    function AutocompleteComponent(elementRef, renderer) {
        this.renderer = renderer;
        this.query = '';
        this.filteredList = [];
        this.historyList = [];
        this.isHistoryListVisible = true;
        this.selectedIdx = -1;
        this.toHighlight = '';
        this.notFound = false;
        this.isFocused = false;
        this.isOpen = false;
        this.isScrollToEnd = false;
        this.overlay = false;
        this.manualOpen = undefined;
        this.manualClose = undefined;
        /**
         * Data of items list.
         * It can be array of strings or array of objects.
         */
        this.data = [];
        this.placeHolder = '';
        /**
         * Heading text of history list.
         * If it is null then history heading is hidden.
         */
        this.historyHeading = 'Recently selected';
        this.historyListMaxNumber = 15;
        this.notFoundText = 'Not found';
        /**
         * The minimum number of characters the user must type before a search is performed.
         */
        this.minQueryLength = 1;
        /**
         * Event that is emitted whenever an item from the list is selected.
         */
        this.selected = new EventEmitter();
        /**
         * Event that is emitted whenever an input is changed.
         */
        this.inputChanged = new EventEmitter();
        /**
         * Event that is emitted whenever an input is focused.
         */
        this.inputFocused = new EventEmitter();
        /**
         * Event that is emitted whenever an input is cleared.
         */
        this.inputCleared = new EventEmitter();
        /**
         * Event that is emitted when the autocomplete panel is opened.
         */
        this.opened = new EventEmitter();
        /**
         * Event that is emitted when the autocomplete panel is closed.
         */
        this.closed = new EventEmitter();
        /**
         * Event that is emitted when scrolled to the end of items.
         */
        this.scrolledToEnd = new EventEmitter();
        /**
         * Propagates new value when model changes
         */
        this.propagateChange = function () {
        };
        this.elementRef = elementRef;
    }
    /**
     * Writes a new value from the form model into the view,
     * Updates model
     */
    /**
     * Writes a new value from the form model into the view,
     * Updates model
     * @param {?} value
     * @return {?}
     */
    AutocompleteComponent.prototype.writeValue = /**
     * Writes a new value from the form model into the view,
     * Updates model
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.query = value;
    };
    /**
     * Registers a handler that is called when something in the view has changed
     */
    /**
     * Registers a handler that is called when something in the view has changed
     * @param {?} fn
     * @return {?}
     */
    AutocompleteComponent.prototype.registerOnChange = /**
     * Registers a handler that is called when something in the view has changed
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.propagateChange = fn;
    };
    /**
     * Registers a handler specifically for when a control receives a touch event
     */
    /**
     * Registers a handler specifically for when a control receives a touch event
     * @param {?} fn
     * @return {?}
     */
    AutocompleteComponent.prototype.registerOnTouched = /**
     * Registers a handler specifically for when a control receives a touch event
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
    };
    /**
     * Event that is called when the value of an input element is changed
     */
    /**
     * Event that is called when the value of an input element is changed
     * @param {?} event
     * @return {?}
     */
    AutocompleteComponent.prototype.onChange = /**
     * Event that is called when the value of an input element is changed
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.propagateChange(event.target.value);
    };
    /**
     * Event that is called when the control status changes to or from DISABLED
     */
    /**
     * Event that is called when the control status changes to or from DISABLED
     * @param {?} isDisabled
     * @return {?}
     */
    AutocompleteComponent.prototype.setDisabledState = /**
     * Event that is called when the control status changes to or from DISABLED
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        this.disabled = isDisabled;
    };
    /**
     * @return {?}
     */
    AutocompleteComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.handleScroll();
        this.initEventStream();
        this.setInitialValue(this.initialValue);
    };
    /**
     * Set initial value
     * @param {?} value
     * @return {?}
     */
    AutocompleteComponent.prototype.setInitialValue = /**
     * Set initial value
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (this.initialValue) {
            this.select(value);
        }
    };
    /**
     * Update search results
     */
    /**
     * Update search results
     * @param {?} changes
     * @return {?}
     */
    AutocompleteComponent.prototype.ngOnChanges = /**
     * Update search results
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes && changes["data"] &&
            Array.isArray(changes["data"].currentValue)) {
            this.handleItemsChange();
            if (!changes["data"].firstChange && this.isFocused) {
                this.handleOpen();
            }
        }
    };
    /**
     * Items change
     * @return {?}
     */
    AutocompleteComponent.prototype.handleItemsChange = /**
     * Items change
     * @return {?}
     */
    function () {
        this.isScrollToEnd = false;
        if (!this.isOpen) {
            return;
        }
        this.filteredList = this.data;
        this.notFound = !this.filteredList || this.filteredList.length === 0;
    };
    /**
     * Filter data
     * @return {?}
     */
    AutocompleteComponent.prototype.filterList = /**
     * Filter data
     * @return {?}
     */
    function () {
        var _this = this;
        this.selectedIdx = -1;
        this.initSearchHistory();
        if (this.query != null && this.data) {
            this.toHighlight = this.query;
            this.filteredList = this.data.filter(function (item) {
                if (typeof item === 'string') {
                    // string logic, check equality of strings
                    return item.toLowerCase().indexOf(_this.query.toLowerCase()) > -1;
                }
                else if (typeof item === 'object' && item.constructor === Object) {
                    // object logic, check property equality
                    return item[_this.searchKeyword].toLowerCase().indexOf(_this.query.toLowerCase()) > -1;
                }
            });
        }
        else {
            this.notFound = false;
        }
    };
    /**
     * Check type of item in the list.
     * @param item
     */
    /**
     * Check type of item in the list.
     * @param {?} item
     * @return {?}
     */
    AutocompleteComponent.prototype.isType = /**
     * Check type of item in the list.
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return typeof item === 'string';
    };
    /**
     * Select item in the list.
     * @param {?} item
     * @return {?}
     */
    AutocompleteComponent.prototype.select = /**
     * Select item in the list.
     * @param {?} item
     * @return {?}
     */
    function (item) {
        var _this = this;
        this.query = !this.isType(item) ? item[this.searchKeyword] : item;
        this.isOpen = true;
        this.overlay = false;
        this.selected.emit(item);
        this.propagateChange(item);
        if (this.initialValue) {
            /** @type {?} */
            var history_1 = window.localStorage.getItem("" + this.historyIdentifier);
            if (history_1) {
                /** @type {?} */
                var existingHistory = JSON.parse(localStorage["" + this.historyIdentifier]);
                if (!(existingHistory instanceof Array))
                    existingHistory = [];
                // check if selected item exists in existingHistory
                if (!existingHistory.some(function (existingItem) { return !_this.isType(existingItem)
                    ? existingItem[_this.searchKeyword] == item[_this.searchKeyword] : existingItem == item; })) {
                    existingHistory.unshift(item);
                    localStorage.setItem("" + this.historyIdentifier, JSON.stringify(existingHistory));
                    // check if items don't exceed max allowed number
                    if (existingHistory.length >= this.historyListMaxNumber) {
                        existingHistory.splice(existingHistory.length - 1, 1);
                        localStorage.setItem("" + this.historyIdentifier, JSON.stringify(existingHistory));
                    }
                }
                else {
                    // if selected item exists in existingHistory swap to top in array
                    if (!this.isType(item)) {
                        /** @type {?} */
                        var copiedExistingHistory = existingHistory.slice();
                        /** @type {?} */
                        var selectedIndex = copiedExistingHistory.map(function (el) { return el[_this.searchKeyword]; }).indexOf(item[this.searchKeyword]);
                        copiedExistingHistory.splice(selectedIndex, 1);
                        copiedExistingHistory.splice(0, 0, item);
                        localStorage.setItem("" + this.historyIdentifier, JSON.stringify(copiedExistingHistory));
                    }
                    else {
                        /** @type {?} */
                        var copiedExistingHistory = existingHistory.slice(); // copy original existingHistory array
                        copiedExistingHistory.splice(copiedExistingHistory.indexOf(item), 1);
                        copiedExistingHistory.splice(0, 0, item);
                        localStorage.setItem("" + this.historyIdentifier, JSON.stringify(copiedExistingHistory));
                    }
                }
            }
            else {
                this.saveHistory(item);
            }
        }
        else {
            this.saveHistory(item);
        }
        this.handleClose();
    };
    /**
     * Document click
     * @param {?} e event
     * @return {?}
     */
    AutocompleteComponent.prototype.handleClick = /**
     * Document click
     * @param {?} e event
     * @return {?}
     */
    function (e) {
        /** @type {?} */
        var clickedComponent = e.target;
        /** @type {?} */
        var inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
                if (this.filteredList.length) {
                    this.handleOpen();
                }
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.handleClose();
        }
    };
    /**
     * Handle body overlay
     */
    /**
     * Handle body overlay
     * @return {?}
     */
    AutocompleteComponent.prototype.handleOverlay = /**
     * Handle body overlay
     * @return {?}
     */
    function () {
        this.overlay = false;
    };
    /**
     * Scroll items
     * @return {?}
     */
    AutocompleteComponent.prototype.handleScroll = /**
     * Scroll items
     * @return {?}
     */
    function () {
        var _this = this;
        this.renderer.listen(this.filteredListElement.nativeElement, 'scroll', function () {
            _this.scrollToEnd();
        });
    };
    /**
     * Define panel state
     */
    /**
     * Define panel state
     * @param {?} event
     * @return {?}
     */
    AutocompleteComponent.prototype.setPanelState = /**
     * Define panel state
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event) {
            event.stopPropagation();
        }
        // If controls are untouched
        if (typeof this.manualOpen === 'undefined'
            && typeof this.manualClose === 'undefined') {
            this.isOpen = false;
            this.handleOpen();
        }
        // If one of the controls is untouched and other is deactivated
        if (typeof this.manualOpen === 'undefined'
            && this.manualClose === false
            || typeof this.manualClose === 'undefined'
                && this.manualOpen === false) {
            this.isOpen = false;
            this.handleOpen();
        }
        // if controls are touched but both are deactivated
        if (this.manualOpen === false && this.manualClose === false) {
            this.isOpen = false;
            this.handleOpen();
        }
        // if open control is touched and activated
        if (this.manualOpen) {
            this.isOpen = false;
            this.handleOpen();
            this.manualOpen = false;
        }
        // if close control is touched and activated
        if (this.manualClose) {
            this.isOpen = true;
            this.handleClose();
            this.manualClose = false;
        }
    };
    /**
     * Manual controls
     */
    /**
     * Manual controls
     * @return {?}
     */
    AutocompleteComponent.prototype.open = /**
     * Manual controls
     * @return {?}
     */
    function () {
        this.manualOpen = true;
        this.isOpen = false;
        this.handleOpen();
    };
    /**
     * @return {?}
     */
    AutocompleteComponent.prototype.close = /**
     * @return {?}
     */
    function () {
        this.manualClose = true;
        this.isOpen = true;
        this.handleClose();
    };
    /**
     * @return {?}
     */
    AutocompleteComponent.prototype.focus = /**
     * @return {?}
     */
    function () {
        this.handleFocus(event);
    };
    /**
     * @return {?}
     */
    AutocompleteComponent.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.remove(event);
    };
    /**
     * Remove search query
     * @param {?} e
     * @return {?}
     */
    AutocompleteComponent.prototype.remove = /**
     * Remove search query
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        this.query = '';
        this.inputCleared.emit();
        this.propagateChange(this.query);
        this.setPanelState(e);
    };
    /**
     * Initialize historyList search
     */
    /**
     * Initialize historyList search
     * @return {?}
     */
    AutocompleteComponent.prototype.initSearchHistory = /**
     * Initialize historyList search
     * @return {?}
     */
    function () {
        this.isHistoryListVisible = false;
        if (this.historyIdentifier && !this.query) {
            /** @type {?} */
            var history_2 = window.localStorage.getItem("" + this.historyIdentifier);
            if (history_2) {
                this.isHistoryListVisible = true;
                this.filteredList = [];
                this.historyList = history_2 ? JSON.parse(history_2) : [];
            }
            else {
                this.isHistoryListVisible = false;
            }
        }
        else {
            this.isHistoryListVisible = false;
        }
    };
    /**
     * @return {?}
     */
    AutocompleteComponent.prototype.handleOpen = /**
     * @return {?}
     */
    function () {
        if (this.isOpen || this.isOpen && !this.isLoading) {
            return;
        }
        // If data exists
        if (this.data && this.data.length) {
            this.isOpen = true;
            this.overlay = true;
            this.filterList();
            this.opened.emit();
        }
    };
    /**
     * @return {?}
     */
    AutocompleteComponent.prototype.handleClose = /**
     * @return {?}
     */
    function () {
        if (!this.isOpen) {
            this.isFocused = false;
            return;
        }
        this.isOpen = false;
        this.overlay = false;
        this.filteredList = [];
        this.selectedIdx = -1;
        this.notFound = false;
        this.isHistoryListVisible = false;
        this.isFocused = false;
        this.closed.emit();
    };
    /**
     * @param {?} e
     * @return {?}
     */
    AutocompleteComponent.prototype.handleFocus = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        //this.searchInput.nativeElement.focus();
        if (this.isFocused) {
            return;
        }
        this.inputFocused.emit(e);
        // if data exists then open
        if (this.data && this.data.length) {
            this.setPanelState(event);
        }
        this.isFocused = true;
    };
    /**
     * @return {?}
     */
    AutocompleteComponent.prototype.scrollToEnd = /**
     * @return {?}
     */
    function () {
        if (this.isScrollToEnd) {
            return;
        }
        /** @type {?} */
        var scrollTop = this.filteredListElement.nativeElement
            .scrollTop;
        /** @type {?} */
        var scrollHeight = this.filteredListElement.nativeElement
            .scrollHeight;
        /** @type {?} */
        var elementHeight = this.filteredListElement.nativeElement
            .clientHeight;
        /** @type {?} */
        var atBottom = scrollHeight === scrollTop + elementHeight;
        if (atBottom) {
            this.scrolledToEnd.emit();
            this.isScrollToEnd = true;
        }
    };
    /**
     * Initialize keyboard events
     */
    /**
     * Initialize keyboard events
     * @return {?}
     */
    AutocompleteComponent.prototype.initEventStream = /**
     * Initialize keyboard events
     * @return {?}
     */
    function () {
        this.inputKeyUp$ = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(map(function (e) { return e; }));
        this.inputKeyDown$ = fromEvent(this.searchInput.nativeElement, 'keydown').pipe(map(function (e) { return e; }));
        this.listenEventStream();
    };
    /**
     * Listen keyboard events
     */
    /**
     * Listen keyboard events
     * @return {?}
     */
    AutocompleteComponent.prototype.listenEventStream = /**
     * Listen keyboard events
     * @return {?}
     */
    function () {
        var _this = this;
        // key up event
        this.inputKeyUp$
            .pipe(filter(function (e) {
            return !isArrowUpDown(e.keyCode) &&
                !isEnter(e.keyCode) &&
                !isESC(e.keyCode) &&
                !isTab(e.keyCode);
        }), debounceTime(this.debounceTime)).subscribe(function (e) {
            _this.onKeyUp(e);
        });
        // cursor up & down
        this.inputKeyDown$.pipe(filter(function (e) { return isArrowUpDown(e.keyCode); })).subscribe(function (e) {
            e.preventDefault();
            _this.onFocusItem(e);
        });
        // enter keyup
        this.inputKeyUp$.pipe(filter(function (e) { return isEnter(e.keyCode); })).subscribe(function (e) {
            //this.onHandleEnter();
        });
        // enter keydown
        this.inputKeyDown$.pipe(filter(function (e) { return isEnter(e.keyCode); })).subscribe(function (e) {
            _this.onHandleEnter();
        });
        // ESC
        this.inputKeyUp$.pipe(filter(function (e) { return isESC(e.keyCode); }, debounceTime(100))).subscribe(function (e) {
            _this.onEsc();
        });
        // delete
        this.inputKeyDown$.pipe(filter(function (e) { return isBackspace(e.keyCode) || isDelete(e.keyCode); })).subscribe(function (e) {
            _this.onDelete();
        });
    };
    /**
     * on keyup == when input changed
     * @param e event
     */
    /**
     * on keyup == when input changed
     * @param {?} e event
     * @return {?}
     */
    AutocompleteComponent.prototype.onKeyUp = /**
     * on keyup == when input changed
     * @param {?} e event
     * @return {?}
     */
    function (e) {
        this.notFound = false; // search results are unknown while typing
        // if input is empty
        if (!this.query) {
            this.notFound = false;
            this.inputChanged.emit(e.target.value);
            this.inputCleared.emit();
            //this.filterList();
            this.setPanelState(e);
        }
        // if query >= to minQueryLength
        if (this.query.length >= this.minQueryLength) {
            this.inputChanged.emit(e.target.value);
            this.filterList();
            // If no results found
            if (!this.filteredList.length && !this.isLoading) {
                this.notFoundText ? this.notFound = true : this.notFound = false;
            }
        }
    };
    /**
     * Keyboard arrow top and arrow bottom
     * @param e event
     */
    /**
     * Keyboard arrow top and arrow bottom
     * @param {?} e event
     * @return {?}
     */
    AutocompleteComponent.prototype.onFocusItem = /**
     * Keyboard arrow top and arrow bottom
     * @param {?} e event
     * @return {?}
     */
    function (e) {
        // move arrow up and down on filteredList or historyList
        if (!this.historyList.length || !this.isHistoryListVisible) {
            /** @type {?} */
            var totalNumItem = this.filteredList.length;
            if (e.key === 'ArrowDown') {
                /** @type {?} */
                var sum = this.selectedIdx;
                sum = (this.selectedIdx === null) ? 0 : sum + 1;
                this.selectedIdx = (totalNumItem + sum) % totalNumItem;
                this.scrollToFocusedItem(this.selectedIdx);
            }
            else if (e.key === 'ArrowUp') {
                if (this.selectedIdx == -1) {
                    this.selectedIdx = 0;
                }
                this.selectedIdx = (totalNumItem + this.selectedIdx - 1) % totalNumItem;
                this.scrollToFocusedItem(this.selectedIdx);
            }
        }
        else {
            /** @type {?} */
            var totalNumItem = this.historyList.length;
            if (e.key === 'ArrowDown') {
                /** @type {?} */
                var sum = this.selectedIdx;
                sum = (this.selectedIdx === null) ? 0 : sum + 1;
                this.selectedIdx = (totalNumItem + sum) % totalNumItem;
                this.scrollToFocusedItem(this.selectedIdx);
            }
            else if (e.key === 'ArrowUp') {
                if (this.selectedIdx == -1) {
                    this.selectedIdx = 0;
                }
                this.selectedIdx = (totalNumItem + this.selectedIdx - 1) % totalNumItem;
                this.scrollToFocusedItem(this.selectedIdx);
            }
        }
    };
    /**
     * Scroll to focused item
     * * @param index
     */
    /**
     * Scroll to focused item
     * * \@param index
     * @param {?} index
     * @return {?}
     */
    AutocompleteComponent.prototype.scrollToFocusedItem = /**
     * Scroll to focused item
     * * \@param index
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var listElement = null;
        // Define list element
        if (!this.historyList.length || !this.isHistoryListVisible) {
            // filteredList element
            listElement = this.filteredListElement.nativeElement;
        }
        else {
            // historyList element
            listElement = this.historyListElement.nativeElement;
        }
        /** @type {?} */
        var items = Array.prototype.slice.call(listElement.childNodes).filter(function (node) {
            if (node.nodeType === 1) {
                // if node is element
                return node.className.includes('item');
            }
            else {
                return false;
            }
        });
        if (!items.length) {
            return;
        }
        /** @type {?} */
        var listHeight = listElement.offsetHeight;
        /** @type {?} */
        var itemHeight = items[index].offsetHeight;
        /** @type {?} */
        var visibleTop = listElement.scrollTop;
        /** @type {?} */
        var visibleBottom = listElement.scrollTop + listHeight - itemHeight;
        /** @type {?} */
        var targetPosition = items[index].offsetTop;
        if (targetPosition < visibleTop) {
            listElement.scrollTop = targetPosition;
        }
        if (targetPosition > visibleBottom) {
            listElement.scrollTop = targetPosition - listHeight + itemHeight;
        }
    };
    /**
     * Select item on enter click
     */
    /**
     * Select item on enter click
     * @return {?}
     */
    AutocompleteComponent.prototype.onHandleEnter = /**
     * Select item on enter click
     * @return {?}
     */
    function () {
        // click enter to choose item from filteredList or historyList
        if (this.selectedIdx > -1) {
            if (!this.historyList.length || !this.isHistoryListVisible) {
                // filteredList
                this.query = !this.isType(this.filteredList[this.selectedIdx])
                    ? this.filteredList[this.selectedIdx][this.searchKeyword]
                    : this.filteredList[this.selectedIdx];
                this.saveHistory(this.filteredList[this.selectedIdx]);
                this.select(this.filteredList[this.selectedIdx]);
            }
            else {
                // historyList
                this.query = !this.isType(this.historyList[this.selectedIdx])
                    ? this.historyList[this.selectedIdx][this.searchKeyword]
                    : this.historyList[this.selectedIdx];
                this.saveHistory(this.historyList[this.selectedIdx]);
                this.select(this.historyList[this.selectedIdx]);
            }
        }
        this.isHistoryListVisible = false;
        this.handleClose();
    };
    /**
     * Esc click
     */
    /**
     * Esc click
     * @return {?}
     */
    AutocompleteComponent.prototype.onEsc = /**
     * Esc click
     * @return {?}
     */
    function () {
        this.searchInput.nativeElement.blur();
        this.handleClose();
    };
    /**
     * Delete click
     */
    /**
     * Delete click
     * @return {?}
     */
    AutocompleteComponent.prototype.onDelete = /**
     * Delete click
     * @return {?}
     */
    function () {
        // panel is open on delete
        this.isOpen = true;
    };
    /**
     * Select item to save in localStorage
     * @param selected
     */
    /**
     * Select item to save in localStorage
     * @param {?} selected
     * @return {?}
     */
    AutocompleteComponent.prototype.saveHistory = /**
     * Select item to save in localStorage
     * @param {?} selected
     * @return {?}
     */
    function (selected) {
        var _this = this;
        if (this.historyIdentifier) {
            // check if selected item exists in historyList
            if (!this.historyList.some(function (item) { return !_this.isType(item)
                ? item[_this.searchKeyword] == selected[_this.searchKeyword] : item == selected; })) {
                this.saveHistoryToLocalStorage(tslib_1.__spread([selected], this.historyList));
                // check if items don't exceed max allowed number
                if (this.historyList.length >= this.historyListMaxNumber) {
                    this.historyList.splice(this.historyList.length - 1, 1);
                    this.saveHistoryToLocalStorage(tslib_1.__spread([selected], this.historyList));
                }
            }
            else {
                // if selected item exists in historyList swap to top in array
                if (!this.isType(selected)) {
                    /** @type {?} */
                    var copiedHistoryList = this.historyList.slice();
                    /** @type {?} */
                    var selectedIndex = copiedHistoryList.map(function (item) { return item[_this.searchKeyword]; }).indexOf(selected[this.searchKeyword]);
                    copiedHistoryList.splice(selectedIndex, 1);
                    copiedHistoryList.splice(0, 0, selected);
                    this.saveHistoryToLocalStorage(tslib_1.__spread(copiedHistoryList));
                }
                else {
                    /** @type {?} */
                    var copiedHistoryList = this.historyList.slice(); // copy original historyList array
                    copiedHistoryList.splice(this.historyList.indexOf(selected), 1);
                    copiedHistoryList.splice(0, 0, selected);
                    this.saveHistoryToLocalStorage(tslib_1.__spread(copiedHistoryList));
                }
            }
        }
    };
    /**
     * Save item in localStorage
     * @param selected
     */
    /**
     * Save item in localStorage
     * @param {?} selected
     * @return {?}
     */
    AutocompleteComponent.prototype.saveHistoryToLocalStorage = /**
     * Save item in localStorage
     * @param {?} selected
     * @return {?}
     */
    function (selected) {
        window.localStorage.setItem("" + this.historyIdentifier, JSON.stringify(selected));
    };
    /**
     * Remove item from localStorage
     * @param index
     * @param e event
     */
    /**
     * Remove item from localStorage
     * @param {?} index
     * @param {?} e event
     * @return {?}
     */
    AutocompleteComponent.prototype.removeHistoryItem = /**
     * Remove item from localStorage
     * @param {?} index
     * @param {?} e event
     * @return {?}
     */
    function (index, e) {
        e.stopPropagation();
        this.historyList = this.historyList.filter(function (v, i) { return i !== index; });
        this.saveHistoryToLocalStorage(this.historyList);
        if (this.historyList.length == 0) {
            window.localStorage.removeItem("" + this.historyIdentifier);
            this.filterList();
        }
    };
    /**
     * Reset localStorage
     * @param e event
     */
    /**
     * Reset localStorage
     * @param {?} e event
     * @return {?}
     */
    AutocompleteComponent.prototype.resetHistoryList = /**
     * Reset localStorage
     * @param {?} e event
     * @return {?}
     */
    function (e) {
        e.stopPropagation();
        this.historyList = [];
        window.localStorage.removeItem("" + this.historyIdentifier);
        this.filterList();
    };
    AutocompleteComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ng-autocomplete',
                    template: "<div class=\"autocomplete-container\"\n     [ngClass]=\"{ 'active': isOpen}\">\n  <div class=\"input-container\">\n    <input #searchInput type=\"text\" placeholder={{placeHolder}}\n           [(ngModel)]=query\n           (input)=\"onChange($event)\"\n           (focus)=handleFocus($event)\n           [disabled]=\"disabled\">\n    <div class=\"x\" *ngIf=\"query && !isLoading\" (click)=\"remove($event)\">\n      <i class=\"material-icons\">close</i>\n    </div>\n    <!--Loading mask-->\n    <div class=\"sk-fading-circle\" *ngIf=\"isLoading\">\n      <div class=\"sk-circle1 sk-circle\"></div>\n      <div class=\"sk-circle2 sk-circle\"></div>\n      <div class=\"sk-circle3 sk-circle\"></div>\n      <div class=\"sk-circle4 sk-circle\"></div>\n      <div class=\"sk-circle5 sk-circle\"></div>\n      <div class=\"sk-circle6 sk-circle\"></div>\n      <div class=\"sk-circle7 sk-circle\"></div>\n      <div class=\"sk-circle8 sk-circle\"></div>\n      <div class=\"sk-circle9 sk-circle\"></div>\n      <div class=\"sk-circle10 sk-circle\"></div>\n      <div class=\"sk-circle11 sk-circle\"></div>\n      <div class=\"sk-circle12 sk-circle\"></div>\n    </div>\n  </div>\n\n  <!--FilteredList items-->\n  <div class=\"suggestions-container\"\n       [ngClass]=\"{ 'is-hidden': isHistoryListVisible, 'is-visible': !isHistoryListVisible}\">\n    <ul #filteredListElement>\n      <li *ngFor=\"let item of filteredList; let idx = index\" class=\"item\">\n        <!--string logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='isType(item)'\n             (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate;  context: { $implicit: item | highlight: toHighlight }\">\n          </ng-container>\n        </div>\n        <!--object logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='!isType(item)'\n             (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate; context: { $implicit: item | highlight: toHighlight : searchKeyword }\">\n          </ng-container>\n        </div>\n\n      </li>\n    </ul>\n  </div>\n\n  <!--HistoryList items-->\n  <div class=\"suggestions-container\"\n       [ngClass]=\"{ 'is-hidden': !isHistoryListVisible, 'is-visible': isHistoryListVisible}\">\n    <!--HistoryList heading-->\n    <div class=\"history-heading\" *ngIf=\"historyList.length > 0 && historyHeading\">\n      <div class=\"text\">{{historyHeading}}</div>\n      <div class=\"x\" (click)=\"resetHistoryList($event)\">\n        <i class=\"material-icons\">delete</i>\n      </div>\n    </div>\n\n    <ul #historyListElement>\n      <li *ngFor=\"let item of historyList; let idx = index\" class=\"item\">\n        <!--string logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='isType(item)' (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate;  context: { $implicit: item }\">\n          </ng-container>\n        </div>\n        <!--object logic-->\n        <div [class.complete-selected]=\"idx === selectedIdx\" *ngIf='!isType(item)' (click)=\"select(item)\">\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate; context: { $implicit: item }\">\n          </ng-container>\n        </div>\n        <div class=\"x\" (click)=\"removeHistoryItem(idx, $event)\">\n          <i class=\"material-icons\">close</i>\n        </div>\n      </li>\n    </ul>\n  </div>\n\n  <!--Not found-->\n  <div class=\"not-found\" *ngIf=\"isLoading ? !isLoading && notFound : notFound\">\n    <ng-container\n      *ngTemplateOutlet=\"notFoundTemplate;  context: { $implicit: notFoundText  }\">\n    </ng-container>\n  </div>\n</div>\n<div class=\"overlay\" *ngIf=\"overlay\" (click)=\"handleOverlay()\"></div>\n",
                    styles: ["@import url(https://fonts.googleapis.com/icon?family=Material+Icons);.ng-autocomplete{width:600px}.autocomplete-container{box-shadow:0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12);position:relative;overflow:visible;height:40px}.autocomplete-container .input-container input{font-size:14px;box-sizing:border-box;border:none;box-shadow:none;outline:0;background-color:#fff;color:rgba(0,0,0,.87);width:100%;padding:0 15px;line-height:40px;height:40px}.autocomplete-container .input-container input:disabled{background-color:#eee;color:#666}.autocomplete-container .input-container .x{position:absolute;right:10px;margin:auto;cursor:pointer;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.autocomplete-container .input-container .x i{color:rgba(0,0,0,.54);font-size:22px;vertical-align:middle}.autocomplete-container .suggestions-container{position:absolute;width:100%;background:#fff;height:auto;box-shadow:0 2px 5px rgba(0,0,0,.25);box-sizing:border-box}.autocomplete-container .suggestions-container ul{padding:0;margin:0;max-height:240px;overflow-y:auto}.autocomplete-container .suggestions-container ul li{position:relative;list-style:none;padding:0;margin:0;cursor:pointer}.autocomplete-container .suggestions-container ul li a{padding:14px 15px;display:block;text-decoration:none;cursor:pointer;color:rgba(0,0,0,.87);font-size:15px}.autocomplete-container .suggestions-container .complete-selected,.autocomplete-container .suggestions-container ul li:hover{background-color:rgba(158,158,158,.18)}.autocomplete-container .suggestions-container .history-heading{position:relative;padding:10px 15px;border:1px solid #f1f1f1}.autocomplete-container .suggestions-container .history-heading .text{font-size:.85em}.autocomplete-container .suggestions-container .x{position:absolute;right:10px;margin:auto;cursor:pointer;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.autocomplete-container .suggestions-container .x i{color:rgba(0,0,0,.54);font-size:18px;vertical-align:middle}.autocomplete-container .suggestions-container.is-hidden{visibility:hidden}.autocomplete-container .suggestions-container.is-visible{visibility:visible}.autocomplete-container .not-found{padding:0 .75em;border:1px solid #f1f1f1;background:#fff}.autocomplete-container .not-found div{padding:.4em 0;font-size:.95em;line-height:1.4;border-bottom:1px solid rgba(230,230,230,.7)}.autocomplete-container.active{z-index:999}.highlight{font-weight:700}.overlay{position:absolute;background-color:transparent;top:0;right:0;bottom:0;left:0;z-index:50}input[type=text]::-ms-clear{display:none}.sk-fading-circle{width:20px;height:20px;position:absolute;right:10px;top:0;bottom:0;margin:auto}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0}.sk-fading-circle .sk-circle:before{content:'';display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;-webkit-animation:1.2s ease-in-out infinite both sk-circleFadeDelay;animation:1.2s ease-in-out infinite both sk-circleFadeDelay}.sk-fading-circle .sk-circle2{-webkit-transform:rotate(30deg);transform:rotate(30deg)}.sk-fading-circle .sk-circle3{-webkit-transform:rotate(60deg);transform:rotate(60deg)}.sk-fading-circle .sk-circle4{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.sk-fading-circle .sk-circle5{-webkit-transform:rotate(120deg);transform:rotate(120deg)}.sk-fading-circle .sk-circle6{-webkit-transform:rotate(150deg);transform:rotate(150deg)}.sk-fading-circle .sk-circle7{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.sk-fading-circle .sk-circle8{-webkit-transform:rotate(210deg);transform:rotate(210deg)}.sk-fading-circle .sk-circle9{-webkit-transform:rotate(240deg);transform:rotate(240deg)}.sk-fading-circle .sk-circle10{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.sk-fading-circle .sk-circle11{-webkit-transform:rotate(300deg);transform:rotate(300deg)}.sk-fading-circle .sk-circle12{-webkit-transform:rotate(330deg);transform:rotate(330deg)}.sk-fading-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.sk-fading-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.sk-fading-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}.sk-fading-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.sk-fading-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}.sk-fading-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.sk-fading-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}.sk-fading-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.sk-fading-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}.sk-fading-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.sk-fading-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}@keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}"],
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return AutocompleteComponent; }),
                            multi: true
                        }
                    ],
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '(document:click)': 'handleClick($event)',
                        'class': 'ng-autocomplete'
                    },
                },] },
    ];
    /** @nocollapse */
    AutocompleteComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    AutocompleteComponent.propDecorators = {
        searchInput: [{ type: ViewChild, args: ['searchInput',] }],
        filteredListElement: [{ type: ViewChild, args: ['filteredListElement',] }],
        historyListElement: [{ type: ViewChild, args: ['historyListElement',] }],
        data: [{ type: Input }],
        searchKeyword: [{ type: Input }],
        placeHolder: [{ type: Input }],
        initialValue: [{ type: Input }],
        historyIdentifier: [{ type: Input }],
        historyHeading: [{ type: Input }],
        historyListMaxNumber: [{ type: Input }],
        notFoundText: [{ type: Input }],
        isLoading: [{ type: Input }],
        debounceTime: [{ type: Input }],
        disabled: [{ type: Input }],
        minQueryLength: [{ type: Input }],
        selected: [{ type: Output }],
        inputChanged: [{ type: Output }],
        inputFocused: [{ type: Output }],
        inputCleared: [{ type: Output }],
        opened: [{ type: Output }],
        closed: [{ type: Output }],
        scrolledToEnd: [{ type: Output }],
        itemTemplate: [{ type: ContentChild, args: [TemplateRef,] }, { type: Input }],
        notFoundTemplate: [{ type: Input }]
    };
    return AutocompleteComponent;
}());
export { AutocompleteComponent };
if (false) {
    /** @type {?} */
    AutocompleteComponent.prototype.searchInput;
    /** @type {?} */
    AutocompleteComponent.prototype.filteredListElement;
    /** @type {?} */
    AutocompleteComponent.prototype.historyListElement;
    /** @type {?} */
    AutocompleteComponent.prototype.inputKeyUp$;
    /** @type {?} */
    AutocompleteComponent.prototype.inputKeyDown$;
    /** @type {?} */
    AutocompleteComponent.prototype.query;
    /** @type {?} */
    AutocompleteComponent.prototype.filteredList;
    /** @type {?} */
    AutocompleteComponent.prototype.historyList;
    /** @type {?} */
    AutocompleteComponent.prototype.isHistoryListVisible;
    /** @type {?} */
    AutocompleteComponent.prototype.elementRef;
    /** @type {?} */
    AutocompleteComponent.prototype.selectedIdx;
    /** @type {?} */
    AutocompleteComponent.prototype.toHighlight;
    /** @type {?} */
    AutocompleteComponent.prototype.notFound;
    /** @type {?} */
    AutocompleteComponent.prototype.isFocused;
    /** @type {?} */
    AutocompleteComponent.prototype.isOpen;
    /** @type {?} */
    AutocompleteComponent.prototype.isScrollToEnd;
    /** @type {?} */
    AutocompleteComponent.prototype.overlay;
    /** @type {?} */
    AutocompleteComponent.prototype.manualOpen;
    /** @type {?} */
    AutocompleteComponent.prototype.manualClose;
    /**
     * Data of items list.
     * It can be array of strings or array of objects.
     * @type {?}
     */
    AutocompleteComponent.prototype.data;
    /** @type {?} */
    AutocompleteComponent.prototype.searchKeyword;
    /** @type {?} */
    AutocompleteComponent.prototype.placeHolder;
    /** @type {?} */
    AutocompleteComponent.prototype.initialValue;
    /**
     * History identifier of history list
     * When valid history identifier is given, then component stores selected item to local storage of user's browser.
     * If it is null then history is hidden.
     * History list is visible if at least one history item is stored.
     * @type {?}
     */
    AutocompleteComponent.prototype.historyIdentifier;
    /**
     * Heading text of history list.
     * If it is null then history heading is hidden.
     * @type {?}
     */
    AutocompleteComponent.prototype.historyHeading;
    /** @type {?} */
    AutocompleteComponent.prototype.historyListMaxNumber;
    /** @type {?} */
    AutocompleteComponent.prototype.notFoundText;
    /** @type {?} */
    AutocompleteComponent.prototype.isLoading;
    /** @type {?} */
    AutocompleteComponent.prototype.debounceTime;
    /** @type {?} */
    AutocompleteComponent.prototype.disabled;
    /**
     * The minimum number of characters the user must type before a search is performed.
     * @type {?}
     */
    AutocompleteComponent.prototype.minQueryLength;
    /**
     * Event that is emitted whenever an item from the list is selected.
     * @type {?}
     */
    AutocompleteComponent.prototype.selected;
    /**
     * Event that is emitted whenever an input is changed.
     * @type {?}
     */
    AutocompleteComponent.prototype.inputChanged;
    /**
     * Event that is emitted whenever an input is focused.
     * @type {?}
     */
    AutocompleteComponent.prototype.inputFocused;
    /**
     * Event that is emitted whenever an input is cleared.
     * @type {?}
     */
    AutocompleteComponent.prototype.inputCleared;
    /**
     * Event that is emitted when the autocomplete panel is opened.
     * @type {?}
     */
    AutocompleteComponent.prototype.opened;
    /**
     * Event that is emitted when the autocomplete panel is closed.
     * @type {?}
     */
    AutocompleteComponent.prototype.closed;
    /**
     * Event that is emitted when scrolled to the end of items.
     * @type {?}
     */
    AutocompleteComponent.prototype.scrolledToEnd;
    /** @type {?} */
    AutocompleteComponent.prototype.itemTemplate;
    /** @type {?} */
    AutocompleteComponent.prototype.notFoundTemplate;
    /**
     * Propagates new value when model changes
     * @type {?}
     */
    AutocompleteComponent.prototype.propagateChange;
    /** @type {?} */
    AutocompleteComponent.prototype.renderer;
}
export { ɵ0, ɵ1, ɵ2, ɵ3, ɵ4, ɵ5, ɵ6, ɵ7 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbmctYXV0b2NvbXBsZXRlLyIsInNvdXJjZXMiOlsibGliL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxZQUFZLEVBQ3ZCLFVBQVUsRUFDVixZQUFZLEVBQUUsVUFBVSxFQUN4QixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDTSxXQUFXLEVBQzFCLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFLdkUsSUFBTSxTQUFTLEdBQUcsVUFBQSxPQUFPLElBQUksT0FBQSxPQUFPLEtBQUssRUFBRSxFQUFkLENBQWMsQ0FBQzs7O0FBQzVDLElBQU0sV0FBVyxHQUFHLFVBQUEsT0FBTyxJQUFJLE9BQUEsT0FBTyxLQUFLLEVBQUUsRUFBZCxDQUFjLENBQUM7OztBQUM5QyxJQUFNLGFBQWEsR0FBRyxVQUFBLE9BQU8sSUFBSSxPQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQTFDLENBQTBDLENBQUM7OztBQUM1RSxJQUFNLE9BQU8sR0FBRyxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sS0FBSyxFQUFFLEVBQWQsQ0FBYyxDQUFDOzs7QUFDMUMsSUFBTSxXQUFXLEdBQUcsVUFBQSxPQUFPLElBQUksT0FBQSxPQUFPLEtBQUssQ0FBQyxFQUFiLENBQWEsQ0FBQzs7O0FBQzdDLElBQU0sUUFBUSxHQUFHLFVBQUEs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VyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEscUJBQXFCLEVBQXJCLENBQXFCLENBQUM7NEJBQ3BELEtBQUssRUFBRSxJQUFJO3lCQUNaO3FCQUNGO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osa0JBQWtCLEVBQUUscUJBQXFCO3dCQUN6QyxPQUFPLEVBQUUsaUJBQWlCO3FCQUMzQjtpQkFDRjs7OztnQkF2SUMsVUFBVTtnQkFLVixTQUFTOzs7OEJBcUlSLFNBQVMsU0FBQyxhQUFhO3NDQUN2QixTQUFTLFNBQUMscUJBQXFCO3FDQUMvQixTQUFTLFNBQUMsb0JBQW9CO3VCQTBCOUIsS0FBSztnQ0FDTCxLQUFLOzhCQUNMLEtBQUs7K0JBQ0wsS0FBSztvQ0FPTCxLQUFLO2lDQUtMLEtBQUs7dUNBQ0wsS0FBSzsrQkFDTCxLQUFLOzRCQUNMLEtBQUs7K0JBQ0wsS0FBSzsyQkFDTCxLQUFLO2lDQUlMLEtBQUs7MkJBS0wsTUFBTTsrQkFHTixNQUFNOytCQUdOLE1BQU07K0JBR04sTUFBTTt5QkFHTixNQUFNO3lCQUdOLE1BQU07Z0NBR04sTUFBTTsrQkFJTixZQUFZLFNBQUMsV0FBVyxjQUN4QixLQUFLO21DQUNMLEtBQUs7O2dDQTdOUjs7U0EySWEscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZixcbiAgSW5wdXQsIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcywgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlYm91bmNlVGltZSwgZmlsdGVyLCBtYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbi8qKlxuICogS2V5Ym9hcmQgZXZlbnRzXG4gKi9cbmNvbnN0IGlzQXJyb3dVcCA9IGtleUNvZGUgPT4ga2V5Q29kZSA9PT0gMzg7XG5jb25zdCBpc0Fycm93RG93biA9IGtleUNvZGUgPT4ga2V5Q29kZSA9PT0gNDA7XG5jb25zdCBpc0Fycm93VXBEb3duID0ga2V5Q29kZSA9PiBpc0Fycm93VXAoa2V5Q29kZSkgfHwgaXNBcnJvd0Rvd24oa2V5Q29kZSk7XG5jb25zdCBpc0VudGVyID0ga2V5Q29kZSA9PiBrZXlDb2RlID09PSAxMztcbmNvbnN0IGlzQmFja3NwYWNlID0ga2V5Q29kZSA9PiBrZXlDb2RlID09PSA4O1xuY29uc3QgaXNEZWxldGUgPSBrZXlDb2RlID0+IGtleUNvZGUgPT09IDQ2O1xuY29uc3QgaXNFU0MgPSBrZXlDb2RlID0+IGtleUNvZGUgPT09IDI3O1xuY29uc3QgaXNUYWIgPSBrZXlDb2RlID0+IGtleUNvZGUgPT09IDk7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmctYXV0b2NvbXBsZXRlJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiYXV0b2NvbXBsZXRlLWNvbnRhaW5lclwiXG4gICAgIFtuZ0NsYXNzXT1cInsgJ2FjdGl2ZSc6IGlzT3Blbn1cIj5cbiAgPGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuICAgIDxpbnB1dCAjc2VhcmNoSW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj17e3BsYWNlSG9sZGVyfX1cbiAgICAgICAgICAgWyhuZ01vZGVsKV09cXVlcnlcbiAgICAgICAgICAgKGlucHV0KT1cIm9uQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAoZm9jdXMpPWhhbmRsZUZvY3VzKCRldmVudClcbiAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgPGRpdiBjbGFzcz1cInhcIiAqbmdJZj1cInF1ZXJ5ICYmICFpc0xvYWRpbmdcIiAoY2xpY2spPVwicmVtb3ZlKCRldmVudClcIj5cbiAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5jbG9zZTwvaT5cbiAgICA8L2Rpdj5cbiAgICA8IS0tTG9hZGluZyBtYXNrLS0+XG4gICAgPGRpdiBjbGFzcz1cInNrLWZhZGluZy1jaXJjbGVcIiAqbmdJZj1cImlzTG9hZGluZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTEgc2stY2lyY2xlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMiBzay1jaXJjbGVcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUzIHNrLWNpcmNsZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTQgc2stY2lyY2xlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlNSBzay1jaXJjbGVcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU2IHNrLWNpcmNsZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTcgc2stY2lyY2xlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlOCBzay1jaXJjbGVcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU5IHNrLWNpcmNsZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTEwIHNrLWNpcmNsZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTExIHNrLWNpcmNsZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTEyIHNrLWNpcmNsZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuICA8IS0tRmlsdGVyZWRMaXN0IGl0ZW1zLS0+XG4gIDxkaXYgY2xhc3M9XCJzdWdnZXN0aW9ucy1jb250YWluZXJcIlxuICAgICAgIFtuZ0NsYXNzXT1cInsgJ2lzLWhpZGRlbic6IGlzSGlzdG9yeUxpc3RWaXNpYmxlLCAnaXMtdmlzaWJsZSc6ICFpc0hpc3RvcnlMaXN0VmlzaWJsZX1cIj5cbiAgICA8dWwgI2ZpbHRlcmVkTGlzdEVsZW1lbnQ+XG4gICAgICA8bGkgKm5nRm9yPVwibGV0IGl0ZW0gb2YgZmlsdGVyZWRMaXN0OyBsZXQgaWR4ID0gaW5kZXhcIiBjbGFzcz1cIml0ZW1cIj5cbiAgICAgICAgPCEtLXN0cmluZyBsb2dpYy0tPlxuICAgICAgICA8ZGl2IFtjbGFzcy5jb21wbGV0ZS1zZWxlY3RlZF09XCJpZHggPT09IHNlbGVjdGVkSWR4XCIgKm5nSWY9J2lzVHlwZShpdGVtKSdcbiAgICAgICAgICAgICAoY2xpY2spPVwic2VsZWN0KGl0ZW0pXCI+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7ICBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB8IGhpZ2hsaWdodDogdG9IaWdobGlnaHQgfVwiPlxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPCEtLW9iamVjdCBsb2dpYy0tPlxuICAgICAgICA8ZGl2IFtjbGFzcy5jb21wbGV0ZS1zZWxlY3RlZF09XCJpZHggPT09IHNlbGVjdGVkSWR4XCIgKm5nSWY9JyFpc1R5cGUoaXRlbSknXG4gICAgICAgICAgICAgKGNsaWNrKT1cInNlbGVjdChpdGVtKVwiPlxuICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB8IGhpZ2hsaWdodDogdG9IaWdobGlnaHQgOiBzZWFyY2hLZXl3b3JkIH1cIj5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgPC9kaXY+XG5cbiAgPCEtLUhpc3RvcnlMaXN0IGl0ZW1zLS0+XG4gIDxkaXYgY2xhc3M9XCJzdWdnZXN0aW9ucy1jb250YWluZXJcIlxuICAgICAgIFtuZ0NsYXNzXT1cInsgJ2lzLWhpZGRlbic6ICFpc0hpc3RvcnlMaXN0VmlzaWJsZSwgJ2lzLXZpc2libGUnOiBpc0hpc3RvcnlMaXN0VmlzaWJsZX1cIj5cbiAgICA8IS0tSGlzdG9yeUxpc3QgaGVhZGluZy0tPlxuICAgIDxkaXYgY2xhc3M9XCJoaXN0b3J5LWhlYWRpbmdcIiAqbmdJZj1cImhpc3RvcnlMaXN0Lmxlbmd0aCA+IDAgJiYgaGlzdG9yeUhlYWRpbmdcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0XCI+e3toaXN0b3J5SGVhZGluZ319PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwieFwiIChjbGljayk9XCJyZXNldEhpc3RvcnlMaXN0KCRldmVudClcIj5cbiAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmRlbGV0ZTwvaT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPHVsICNoaXN0b3J5TGlzdEVsZW1lbnQ+XG4gICAgICA8bGkgKm5nRm9yPVwibGV0IGl0ZW0gb2YgaGlzdG9yeUxpc3Q7IGxldCBpZHggPSBpbmRleFwiIGNsYXNzPVwiaXRlbVwiPlxuICAgICAgICA8IS0tc3RyaW5nIGxvZ2ljLS0+XG4gICAgICAgIDxkaXYgW2NsYXNzLmNvbXBsZXRlLXNlbGVjdGVkXT1cImlkeCA9PT0gc2VsZWN0ZWRJZHhcIiAqbmdJZj0naXNUeXBlKGl0ZW0pJyAoY2xpY2spPVwic2VsZWN0KGl0ZW0pXCI+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7ICBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB9XCI+XG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8IS0tb2JqZWN0IGxvZ2ljLS0+XG4gICAgICAgIDxkaXYgW2NsYXNzLmNvbXBsZXRlLXNlbGVjdGVkXT1cImlkeCA9PT0gc2VsZWN0ZWRJZHhcIiAqbmdJZj0nIWlzVHlwZShpdGVtKScgKGNsaWNrKT1cInNlbGVjdChpdGVtKVwiPlxuICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB9XCI+XG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwieFwiIChjbGljayk9XCJyZW1vdmVIaXN0b3J5SXRlbShpZHgsICRldmVudClcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+Y2xvc2U8L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICA8L2Rpdj5cblxuICA8IS0tTm90IGZvdW5kLS0+XG4gIDxkaXYgY2xhc3M9XCJub3QtZm91bmRcIiAqbmdJZj1cImlzTG9hZGluZyA/ICFpc0xvYWRpbmcgJiYgbm90Rm91bmQgOiBub3RGb3VuZFwiPlxuICAgIDxuZy1jb250YWluZXJcbiAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwibm90Rm91bmRUZW1wbGF0ZTsgIGNvbnRleHQ6IHsgJGltcGxpY2l0OiBub3RGb3VuZFRleHQgIH1cIj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgPC9kaXY+XG48L2Rpdj5cbjxkaXYgY2xhc3M9XCJvdmVybGF5XCIgKm5nSWY9XCJvdmVybGF5XCIgKGNsaWNrKT1cImhhbmRsZU92ZXJsYXkoKVwiPjwvZGl2PlxuYCxcbiAgc3R5bGVzOiBbYEBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vaWNvbj9mYW1pbHk9TWF0ZXJpYWwrSWNvbnMpOy5uZy1hdXRvY29tcGxldGV7d2lkdGg6NjAwcHh9LmF1dG9jb21wbGV0ZS1jb250YWluZXJ7Ym94LXNoYWRvdzowIDFweCAzcHggMCByZ2JhKDAsMCwwLC4yKSwwIDFweCAxcHggMCByZ2JhKDAsMCwwLC4xNCksMCAycHggMXB4IC0xcHggcmdiYSgwLDAsMCwuMTIpO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OnZpc2libGU7aGVpZ2h0OjQwcHh9LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLmlucHV0LWNvbnRhaW5lciBpbnB1dHtmb250LXNpemU6MTRweDtib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym9yZGVyOm5vbmU7Ym94LXNoYWRvdzpub25lO291dGxpbmU6MDtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Y29sb3I6cmdiYSgwLDAsMCwuODcpO3dpZHRoOjEwMCU7cGFkZGluZzowIDE1cHg7bGluZS1oZWlnaHQ6NDBweDtoZWlnaHQ6NDBweH0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuaW5wdXQtY29udGFpbmVyIGlucHV0OmRpc2FibGVke2JhY2tncm91bmQtY29sb3I6I2VlZTtjb2xvcjojNjY2fS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5pbnB1dC1jb250YWluZXIgLnh7cG9zaXRpb246YWJzb2x1dGU7cmlnaHQ6MTBweDttYXJnaW46YXV0bztjdXJzb3I6cG9pbnRlcjt0b3A6NTAlOy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLmlucHV0LWNvbnRhaW5lciAueCBpe2NvbG9yOnJnYmEoMCwwLDAsLjU0KTtmb250LXNpemU6MjJweDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLnN1Z2dlc3Rpb25zLWNvbnRhaW5lcntwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxMDAlO2JhY2tncm91bmQ6I2ZmZjtoZWlnaHQ6YXV0bztib3gtc2hhZG93OjAgMnB4IDVweCByZ2JhKDAsMCwwLC4yNSk7Ym94LXNpemluZzpib3JkZXItYm94fS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5zdWdnZXN0aW9ucy1jb250YWluZXIgdWx7cGFkZGluZzowO21hcmdpbjowO21heC1oZWlnaHQ6MjQwcHg7b3ZlcmZsb3cteTphdXRvfS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5zdWdnZXN0aW9ucy1jb250YWluZXIgdWwgbGl7cG9zaXRpb246cmVsYXRpdmU7bGlzdC1zdHlsZTpub25lO3BhZGRpbmc6MDttYXJnaW46MDtjdXJzb3I6cG9pbnRlcn0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuc3VnZ2VzdGlvbnMtY29udGFpbmVyIHVsIGxpIGF7cGFkZGluZzoxNHB4IDE1cHg7ZGlzcGxheTpibG9jazt0ZXh0LWRlY29yYXRpb246bm9uZTtjdXJzb3I6cG9pbnRlcjtjb2xvcjpyZ2JhKDAsMCwwLC44Nyk7Zm9udC1zaXplOjE1cHh9LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLnN1Z2dlc3Rpb25zLWNvbnRhaW5lciAuY29tcGxldGUtc2VsZWN0ZWQsLmF1dG9jb21wbGV0ZS1jb250YWluZXIgLnN1Z2dlc3Rpb25zLWNvbnRhaW5lciB1bCBsaTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMTU4LDE1OCwxNTgsLjE4KX0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuc3VnZ2VzdGlvbnMtY29udGFpbmVyIC5oaXN0b3J5LWhlYWRpbmd7cG9zaXRpb246cmVsYXRpdmU7cGFkZGluZzoxMHB4IDE1cHg7Ym9yZGVyOjFweCBzb2xpZCAjZjFmMWYxfS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5zdWdnZXN0aW9ucy1jb250YWluZXIgLmhpc3RvcnktaGVhZGluZyAudGV4dHtmb250LXNpemU6Ljg1ZW19LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLnN1Z2dlc3Rpb25zLWNvbnRhaW5lciAueHtwb3NpdGlvbjphYnNvbHV0ZTtyaWdodDoxMHB4O21hcmdpbjphdXRvO2N1cnNvcjpwb2ludGVyO3RvcDo1MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuc3VnZ2VzdGlvbnMtY29udGFpbmVyIC54IGl7Y29sb3I6cmdiYSgwLDAsMCwuNTQpO2ZvbnQtc2l6ZToxOHB4O3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuc3VnZ2VzdGlvbnMtY29udGFpbmVyLmlzLWhpZGRlbnt2aXNpYmlsaXR5OmhpZGRlbn0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuc3VnZ2VzdGlvbnMtY29udGFpbmVyLmlzLXZpc2libGV7dmlzaWJpbGl0eTp2aXNpYmxlfS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5ub3QtZm91bmR7cGFkZGluZzowIC43NWVtO2JvcmRlcjoxcHggc29saWQgI2YxZjFmMTtiYWNrZ3JvdW5kOiNmZmZ9LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLm5vdC1mb3VuZCBkaXZ7cGFkZGluZzouNGVtIDA7Zm9udC1zaXplOi45NWVtO2xpbmUtaGVpZ2h0OjEuNDtib3JkZXItYm90dG9tOjFweCBzb2xpZCByZ2JhKDIzMCwyMzAsMjMwLC43KX0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lci5hY3RpdmV7ei1pbmRleDo5OTl9LmhpZ2hsaWdodHtmb250LXdlaWdodDo3MDB9Lm92ZXJsYXl7cG9zaXRpb246YWJzb2x1dGU7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDt0b3A6MDtyaWdodDowO2JvdHRvbTowO2xlZnQ6MDt6LWluZGV4OjUwfWlucHV0W3R5cGU9dGV4dF06Oi1tcy1jbGVhcntkaXNwbGF5Om5vbmV9LnNrLWZhZGluZy1jaXJjbGV7d2lkdGg6MjBweDtoZWlnaHQ6MjBweDtwb3NpdGlvbjphYnNvbHV0ZTtyaWdodDoxMHB4O3RvcDowO2JvdHRvbTowO21hcmdpbjphdXRvfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGV7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjB9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTpiZWZvcmV7Y29udGVudDonJztkaXNwbGF5OmJsb2NrO21hcmdpbjowIGF1dG87d2lkdGg6MTUlO2hlaWdodDoxNSU7YmFja2dyb3VuZC1jb2xvcjojMzMzO2JvcmRlci1yYWRpdXM6MTAwJTstd2Via2l0LWFuaW1hdGlvbjoxLjJzIGVhc2UtaW4tb3V0IGluZmluaXRlIGJvdGggc2stY2lyY2xlRmFkZURlbGF5O2FuaW1hdGlvbjoxLjJzIGVhc2UtaW4tb3V0IGluZmluaXRlIGJvdGggc2stY2lyY2xlRmFkZURlbGF5fS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUyey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgzMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgzMGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTN7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDYwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDYwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNHstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoOTBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU1ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgxMjBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMTIwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNnstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMTUwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDE1MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTd7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU4ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgyMTBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMjEwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMjQwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDI0MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTEwey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgyNzBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMjcwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTF7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDMwMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMnstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMzMwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMzMGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTI6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0xLjFzO2FuaW1hdGlvbi1kZWxheTotMS4xc30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMzpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LTFzO2FuaW1hdGlvbi1kZWxheTotMXN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTQ6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uOXM7YW5pbWF0aW9uLWRlbGF5Oi0uOXN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTU6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uOHM7YW5pbWF0aW9uLWRlbGF5Oi0uOHN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTY6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uN3M7YW5pbWF0aW9uLWRlbGF5Oi0uN3N9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTc6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uNnM7YW5pbWF0aW9uLWRlbGF5Oi0uNnN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTg6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uNXM7YW5pbWF0aW9uLWRlbGF5Oi0uNXN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTk6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uNHM7YW5pbWF0aW9uLWRlbGF5Oi0uNHN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTEwOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotLjNzO2FuaW1hdGlvbi1kZWxheTotLjNzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS4yczthbmltYXRpb24tZGVsYXk6LS4yc30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTI6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uMXM7YW5pbWF0aW9uLWRlbGF5Oi0uMXN9QC13ZWJraXQta2V5ZnJhbWVzIHNrLWNpcmNsZUZhZGVEZWxheXswJSwxMDAlLDM5JXtvcGFjaXR5OjB9NDAle29wYWNpdHk6MX19QGtleWZyYW1lcyBzay1jaXJjbGVGYWRlRGVsYXl7MCUsMTAwJSwzOSV7b3BhY2l0eTowfTQwJXtvcGFjaXR5OjF9fWBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEF1dG9jb21wbGV0ZUNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICcoZG9jdW1lbnQ6Y2xpY2spJzogJ2hhbmRsZUNsaWNrKCRldmVudCknLFxuICAgICdjbGFzcyc6ICduZy1hdXRvY29tcGxldGUnXG4gIH0sXG59KVxuXG5leHBvcnQgY2xhc3MgQXV0b2NvbXBsZXRlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgQFZpZXdDaGlsZCgnc2VhcmNoSW5wdXQnKSBzZWFyY2hJbnB1dDogRWxlbWVudFJlZjsgLy8gaW5wdXQgZWxlbWVudFxuICBAVmlld0NoaWxkKCdmaWx0ZXJlZExpc3RFbGVtZW50JykgZmlsdGVyZWRMaXN0RWxlbWVudDogRWxlbWVudFJlZjsgLy8gZWxlbWVudCBvZiBpdGVtc1xuICBAVmlld0NoaWxkKCdoaXN0b3J5TGlzdEVsZW1lbnQnKSBoaXN0b3J5TGlzdEVsZW1lbnQ6IEVsZW1lbnRSZWY7IC8vIGVsZW1lbnQgb2YgaGlzdG9yeSBpdGVtc1xuXG4gIGlucHV0S2V5VXAkOiBPYnNlcnZhYmxlPGFueT47IC8vIGlucHV0IGV2ZW50c1xuICBpbnB1dEtleURvd24kOiBPYnNlcnZhYmxlPGFueT47IC8vIGlucHV0IGV2ZW50c1xuXG4gIHB1YmxpYyBxdWVyeSA9ICcnOyAvLyBzZWFyY2ggcXVlcnlcbiAgcHVibGljIGZpbHRlcmVkTGlzdCA9IFtdOyAvLyBsaXN0IG9mIGl0ZW1zXG4gIHB1YmxpYyBoaXN0b3J5TGlzdCA9IFtdOyAvLyBsaXN0IG9mIGhpc3RvcnkgaXRlbXNcbiAgcHVibGljIGlzSGlzdG9yeUxpc3RWaXNpYmxlID0gdHJ1ZTtcbiAgcHVibGljIGVsZW1lbnRSZWY7XG4gIHB1YmxpYyBzZWxlY3RlZElkeCA9IC0xO1xuICBwdWJsaWMgdG9IaWdobGlnaHQ6IHN0cmluZyA9ICcnO1xuICBwdWJsaWMgbm90Rm91bmQgPSBmYWxzZTtcbiAgcHVibGljIGlzRm9jdXNlZCA9IGZhbHNlO1xuICBwdWJsaWMgaXNPcGVuID0gZmFsc2U7XG4gIHB1YmxpYyBpc1Njcm9sbFRvRW5kID0gZmFsc2U7XG4gIHB1YmxpYyBvdmVybGF5ID0gZmFsc2U7XG4gIHByaXZhdGUgbWFudWFsT3BlbiA9IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBtYW51YWxDbG9zZSA9IHVuZGVmaW5lZDtcblxuXG4gIC8vIGlucHV0c1xuICAvKipcbiAgICogRGF0YSBvZiBpdGVtcyBsaXN0LlxuICAgKiBJdCBjYW4gYmUgYXJyYXkgb2Ygc3RyaW5ncyBvciBhcnJheSBvZiBvYmplY3RzLlxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGRhdGEgPSBbXTtcbiAgQElucHV0KCkgcHVibGljIHNlYXJjaEtleXdvcmQ6IHN0cmluZzsgLy8ga2V5d29yZCB0byBmaWx0ZXIgdGhlIGxpc3RcbiAgQElucHV0KCkgcHVibGljIHBsYWNlSG9sZGVyID0gJyc7IC8vIGlucHV0IHBsYWNlaG9sZGVyXG4gIEBJbnB1dCgpIHB1YmxpYyBpbml0aWFsVmFsdWU6IGFueTsgLy8gc2V0IGluaXRpYWwgdmFsdWVcbiAgLyoqXG4gICAqIEhpc3RvcnkgaWRlbnRpZmllciBvZiBoaXN0b3J5IGxpc3RcbiAgICogV2hlbiB2YWxpZCBoaXN0b3J5IGlkZW50aWZpZXIgaXMgZ2l2ZW4sIHRoZW4gY29tcG9uZW50IHN0b3JlcyBzZWxlY3RlZCBpdGVtIHRvIGxvY2FsIHN0b3JhZ2Ugb2YgdXNlcidzIGJyb3dzZXIuXG4gICAqIElmIGl0IGlzIG51bGwgdGhlbiBoaXN0b3J5IGlzIGhpZGRlbi5cbiAgICogSGlzdG9yeSBsaXN0IGlzIHZpc2libGUgaWYgYXQgbGVhc3Qgb25lIGhpc3RvcnkgaXRlbSBpcyBzdG9yZWQuXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgaGlzdG9yeUlkZW50aWZpZXI6IHN0cmluZztcbiAgLyoqXG4gICAqIEhlYWRpbmcgdGV4dCBvZiBoaXN0b3J5IGxpc3QuXG4gICAqIElmIGl0IGlzIG51bGwgdGhlbiBoaXN0b3J5IGhlYWRpbmcgaXMgaGlkZGVuLlxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGhpc3RvcnlIZWFkaW5nID0gJ1JlY2VudGx5IHNlbGVjdGVkJztcbiAgQElucHV0KCkgcHVibGljIGhpc3RvcnlMaXN0TWF4TnVtYmVyID0gMTU7IC8vIG1heGltdW0gbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBoaXN0b3J5IGxpc3QuXG4gIEBJbnB1dCgpIHB1YmxpYyBub3RGb3VuZFRleHQgPSAnTm90IGZvdW5kJzsgLy8gc2V0IGN1c3RvbSB0ZXh0IHdoZW4gZmlsdGVyIHJldHVybnMgZW1wdHkgcmVzdWx0XG4gIEBJbnB1dCgpIHB1YmxpYyBpc0xvYWRpbmc6IGJvb2xlYW47IC8vIGxvYWRpbmcgbWFza1xuICBASW5wdXQoKSBwdWJsaWMgZGVib3VuY2VUaW1lOiA0MDA7IC8vIGRlbGF5IHRpbWUgd2hpbGUgdHlwaW5nXG4gIEBJbnB1dCgpIHB1YmxpYyBkaXNhYmxlZDogYm9vbGVhbjsgLy8gaW5wdXQgZGlzYWJsZS9lbmFibGVcbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoZSB1c2VyIG11c3QgdHlwZSBiZWZvcmUgYSBzZWFyY2ggaXMgcGVyZm9ybWVkLlxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIG1pblF1ZXJ5TGVuZ3RoID0gMTtcblxuXG4gIC8vIG91dHB1dCBldmVudHNcbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuZXZlciBhbiBpdGVtIGZyb20gdGhlIGxpc3QgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSBzZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbmV2ZXIgYW4gaW5wdXQgaXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIGlucHV0Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbmV2ZXIgYW4gaW5wdXQgaXMgZm9jdXNlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGlucHV0Rm9jdXNlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbmV2ZXIgYW4gaW5wdXQgaXMgY2xlYXJlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGlucHV0Q2xlYXJlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiBzY3JvbGxlZCB0byB0aGUgZW5kIG9mIGl0ZW1zLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2Nyb2xsZWRUb0VuZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cbiAgLy8gY3VzdG9tIHRlbXBsYXRlc1xuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKVxuICBASW5wdXQoKSBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBJbnB1dCgpIG5vdEZvdW5kVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZXMgbmV3IHZhbHVlIHdoZW4gbW9kZWwgY2hhbmdlc1xuICAgKi9cbiAgcHJvcGFnYXRlQ2hhbmdlOiBhbnkgPSAoKSA9PiB7XG4gIH07XG5cblxuICAvKipcbiAgICogV3JpdGVzIGEgbmV3IHZhbHVlIGZyb20gdGhlIGZvcm0gbW9kZWwgaW50byB0aGUgdmlldyxcbiAgICogVXBkYXRlcyBtb2RlbFxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5xdWVyeSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGhhbmRsZXIgdGhhdCBpcyBjYWxsZWQgd2hlbiBzb21ldGhpbmcgaW4gdGhlIHZpZXcgaGFzIGNoYW5nZWRcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGhhbmRsZXIgc3BlY2lmaWNhbGx5IGZvciB3aGVuIGEgY29udHJvbCByZWNlaXZlcyBhIHRvdWNoIGV2ZW50XG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIHZhbHVlIG9mIGFuIGlucHV0IGVsZW1lbnQgaXMgY2hhbmdlZFxuICAgKi9cbiAgb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudFJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHN0YXR1cyBjaGFuZ2VzIHRvIG9yIGZyb20gRElTQUJMRURcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGwoKTtcbiAgICB0aGlzLmluaXRFdmVudFN0cmVhbSgpO1xuICAgIHRoaXMuc2V0SW5pdGlhbFZhbHVlKHRoaXMuaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgaW5pdGlhbCB2YWx1ZVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHB1YmxpYyBzZXRJbml0aWFsVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLmluaXRpYWxWYWx1ZSkge1xuICAgICAgdGhpcy5zZWxlY3QodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgc2VhcmNoIHJlc3VsdHNcbiAgICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBjaGFuZ2VzICYmXG4gICAgICBjaGFuZ2VzLmRhdGEgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkoY2hhbmdlcy5kYXRhLmN1cnJlbnRWYWx1ZSlcbiAgICApIHtcbiAgICAgIHRoaXMuaGFuZGxlSXRlbXNDaGFuZ2UoKTtcbiAgICAgIGlmICghY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlICYmIHRoaXMuaXNGb2N1c2VkKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlT3BlbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVtcyBjaGFuZ2VcbiAgICovXG4gIHB1YmxpYyBoYW5kbGVJdGVtc0NoYW5nZSgpIHtcbiAgICB0aGlzLmlzU2Nyb2xsVG9FbmQgPSBmYWxzZTtcbiAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJlZExpc3QgPSB0aGlzLmRhdGE7XG4gICAgdGhpcy5ub3RGb3VuZCA9ICF0aGlzLmZpbHRlcmVkTGlzdCB8fCB0aGlzLmZpbHRlcmVkTGlzdC5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVyIGRhdGFcbiAgICovXG4gIHB1YmxpYyBmaWx0ZXJMaXN0KCkge1xuICAgIHRoaXMuc2VsZWN0ZWRJZHggPSAtMTtcbiAgICB0aGlzLmluaXRTZWFyY2hIaXN0b3J5KCk7XG4gICAgaWYgKHRoaXMucXVlcnkgIT0gbnVsbCAmJiB0aGlzLmRhdGEpIHtcbiAgICAgIHRoaXMudG9IaWdobGlnaHQgPSB0aGlzLnF1ZXJ5O1xuICAgICAgdGhpcy5maWx0ZXJlZExpc3QgPSB0aGlzLmRhdGEuZmlsdGVyKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIHN0cmluZyBsb2dpYywgY2hlY2sgZXF1YWxpdHkgb2Ygc3RyaW5nc1xuICAgICAgICAgIHJldHVybiBpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpID4gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIGl0ZW0uY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuICAgICAgICAgIC8vIG9iamVjdCBsb2dpYywgY2hlY2sgcHJvcGVydHkgZXF1YWxpdHlcbiAgICAgICAgICByZXR1cm4gaXRlbVt0aGlzLnNlYXJjaEtleXdvcmRdLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpID4gLTE7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vdEZvdW5kID0gZmFsc2U7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogQ2hlY2sgdHlwZSBvZiBpdGVtIGluIHRoZSBsaXN0LlxuICAgKiBAcGFyYW0gaXRlbVxuICAgKi9cbiAgaXNUeXBlKGl0ZW0pIHtcbiAgICByZXR1cm4gdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdCBpdGVtIGluIHRoZSBsaXN0LlxuICAgKiBAcGFyYW0gaXRlbVxuICAgKi9cbiAgcHVibGljIHNlbGVjdChpdGVtKSB7XG4gICAgdGhpcy5xdWVyeSA9ICF0aGlzLmlzVHlwZShpdGVtKSA/IGl0ZW1bdGhpcy5zZWFyY2hLZXl3b3JkXSA6IGl0ZW07XG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgIHRoaXMub3ZlcmxheSA9IGZhbHNlO1xuICAgIHRoaXMuc2VsZWN0ZWQuZW1pdChpdGVtKTtcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShpdGVtKTtcblxuICAgIGlmICh0aGlzLmluaXRpYWxWYWx1ZSkge1xuICAgICAgLy8gY2hlY2sgaWYgaGlzdG9yeSBhbHJlYWR5IGV4aXN0cyBpbiBsb2NhbFN0b3JhZ2UgYW5kIHRoZW4gdXBkYXRlXG4gICAgICBjb25zdCBoaXN0b3J5ID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMuaGlzdG9yeUlkZW50aWZpZXJ9YCk7XG4gICAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgICBsZXQgZXhpc3RpbmdIaXN0b3J5ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbYCR7dGhpcy5oaXN0b3J5SWRlbnRpZmllcn1gXSk7XG4gICAgICAgIGlmICghKGV4aXN0aW5nSGlzdG9yeSBpbnN0YW5jZW9mIEFycmF5KSkgZXhpc3RpbmdIaXN0b3J5ID0gW107XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgc2VsZWN0ZWQgaXRlbSBleGlzdHMgaW4gZXhpc3RpbmdIaXN0b3J5XG4gICAgICAgIGlmICghZXhpc3RpbmdIaXN0b3J5LnNvbWUoKGV4aXN0aW5nSXRlbSkgPT4gIXRoaXMuaXNUeXBlKGV4aXN0aW5nSXRlbSlcbiAgICAgICAgICA/IGV4aXN0aW5nSXRlbVt0aGlzLnNlYXJjaEtleXdvcmRdID09IGl0ZW1bdGhpcy5zZWFyY2hLZXl3b3JkXSA6IGV4aXN0aW5nSXRlbSA9PSBpdGVtKSkge1xuICAgICAgICAgIGV4aXN0aW5nSGlzdG9yeS51bnNoaWZ0KGl0ZW0pO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3RoaXMuaGlzdG9yeUlkZW50aWZpZXJ9YCwgSlNPTi5zdHJpbmdpZnkoZXhpc3RpbmdIaXN0b3J5KSk7XG5cbiAgICAgICAgICAvLyBjaGVjayBpZiBpdGVtcyBkb24ndCBleGNlZWQgbWF4IGFsbG93ZWQgbnVtYmVyXG4gICAgICAgICAgaWYgKGV4aXN0aW5nSGlzdG9yeS5sZW5ndGggPj0gdGhpcy5oaXN0b3J5TGlzdE1heE51bWJlcikge1xuICAgICAgICAgICAgZXhpc3RpbmdIaXN0b3J5LnNwbGljZShleGlzdGluZ0hpc3RvcnkubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLmhpc3RvcnlJZGVudGlmaWVyfWAsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nSGlzdG9yeSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiBzZWxlY3RlZCBpdGVtIGV4aXN0cyBpbiBleGlzdGluZ0hpc3Rvcnkgc3dhcCB0byB0b3AgaW4gYXJyYXlcbiAgICAgICAgICBpZiAoIXRoaXMuaXNUeXBlKGl0ZW0pKSB7XG4gICAgICAgICAgICAvLyBvYmplY3QgbG9naWNcbiAgICAgICAgICAgIGNvbnN0IGNvcGllZEV4aXN0aW5nSGlzdG9yeSA9IGV4aXN0aW5nSGlzdG9yeS5zbGljZSgpOyAvLyBjb3B5IG9yaWdpbmFsIGV4aXN0aW5nSGlzdG9yeSBhcnJheVxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IGNvcGllZEV4aXN0aW5nSGlzdG9yeS5tYXAoKGVsKSA9PiBlbFt0aGlzLnNlYXJjaEtleXdvcmRdKS5pbmRleE9mKGl0ZW1bdGhpcy5zZWFyY2hLZXl3b3JkXSk7XG4gICAgICAgICAgICBjb3BpZWRFeGlzdGluZ0hpc3Rvcnkuc3BsaWNlKHNlbGVjdGVkSW5kZXgsIDEpO1xuICAgICAgICAgICAgY29waWVkRXhpc3RpbmdIaXN0b3J5LnNwbGljZSgwLCAwLCBpdGVtKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3RoaXMuaGlzdG9yeUlkZW50aWZpZXJ9YCwgSlNPTi5zdHJpbmdpZnkoY29waWVkRXhpc3RpbmdIaXN0b3J5KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHN0cmluZyBsb2dpY1xuICAgICAgICAgICAgY29uc3QgY29waWVkRXhpc3RpbmdIaXN0b3J5ID0gZXhpc3RpbmdIaXN0b3J5LnNsaWNlKCk7IC8vIGNvcHkgb3JpZ2luYWwgZXhpc3RpbmdIaXN0b3J5IGFycmF5XG4gICAgICAgICAgICBjb3BpZWRFeGlzdGluZ0hpc3Rvcnkuc3BsaWNlKGNvcGllZEV4aXN0aW5nSGlzdG9yeS5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgIGNvcGllZEV4aXN0aW5nSGlzdG9yeS5zcGxpY2UoMCwgMCwgaXRlbSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLmhpc3RvcnlJZGVudGlmaWVyfWAsIEpTT04uc3RyaW5naWZ5KGNvcGllZEV4aXN0aW5nSGlzdG9yeSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zYXZlSGlzdG9yeShpdGVtKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zYXZlSGlzdG9yeShpdGVtKTtcbiAgICB9XG4gICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvY3VtZW50IGNsaWNrXG4gICAqIEBwYXJhbSBlIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgaGFuZGxlQ2xpY2soZSkge1xuICAgIGxldCBjbGlja2VkQ29tcG9uZW50ID0gZS50YXJnZXQ7XG4gICAgbGV0IGluc2lkZSA9IGZhbHNlO1xuICAgIGRvIHtcbiAgICAgIGlmIChjbGlja2VkQ29tcG9uZW50ID09PSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkge1xuICAgICAgICBpbnNpZGUgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJlZExpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVPcGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNsaWNrZWRDb21wb25lbnQgPSBjbGlja2VkQ29tcG9uZW50LnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoY2xpY2tlZENvbXBvbmVudCk7XG4gICAgaWYgKCFpbnNpZGUpIHtcbiAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGJvZHkgb3ZlcmxheVxuICAgKi9cbiAgaGFuZGxlT3ZlcmxheSgpIHtcbiAgICB0aGlzLm92ZXJsYXkgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY3JvbGwgaXRlbXNcbiAgICovXG4gIHB1YmxpYyBoYW5kbGVTY3JvbGwoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5maWx0ZXJlZExpc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNjcm9sbFRvRW5kKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHBhbmVsIHN0YXRlXG4gICAqL1xuICBzZXRQYW5lbFN0YXRlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICAgLy8gSWYgY29udHJvbHMgYXJlIHVudG91Y2hlZFxuICAgIGlmICh0eXBlb2YgdGhpcy5tYW51YWxPcGVuID09PSAndW5kZWZpbmVkJ1xuICAgICAgJiYgdHlwZW9mIHRoaXMubWFudWFsQ2xvc2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5oYW5kbGVPcGVuKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgb25lIG9mIHRoZSBjb250cm9scyBpcyB1bnRvdWNoZWQgYW5kIG90aGVyIGlzIGRlYWN0aXZhdGVkXG4gICAgaWYgKHR5cGVvZiB0aGlzLm1hbnVhbE9wZW4gPT09ICd1bmRlZmluZWQnXG4gICAgICAmJiB0aGlzLm1hbnVhbENsb3NlID09PSBmYWxzZVxuICAgICAgfHwgdHlwZW9mIHRoaXMubWFudWFsQ2xvc2UgPT09ICd1bmRlZmluZWQnXG4gICAgICAmJiB0aGlzLm1hbnVhbE9wZW4gPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5oYW5kbGVPcGVuKCk7XG4gICAgfVxuXG4gICAgLy8gaWYgY29udHJvbHMgYXJlIHRvdWNoZWQgYnV0IGJvdGggYXJlIGRlYWN0aXZhdGVkXG4gICAgaWYgKHRoaXMubWFudWFsT3BlbiA9PT0gZmFsc2UgJiYgdGhpcy5tYW51YWxDbG9zZSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgICB0aGlzLmhhbmRsZU9wZW4oKTtcbiAgICB9XG5cbiAgICAvLyBpZiBvcGVuIGNvbnRyb2wgaXMgdG91Y2hlZCBhbmQgYWN0aXZhdGVkXG4gICAgaWYgKHRoaXMubWFudWFsT3Blbikge1xuICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuaGFuZGxlT3BlbigpO1xuICAgICAgdGhpcy5tYW51YWxPcGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaWYgY2xvc2UgY29udHJvbCBpcyB0b3VjaGVkIGFuZCBhY3RpdmF0ZWRcbiAgICBpZiAodGhpcy5tYW51YWxDbG9zZSkge1xuICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgICAgdGhpcy5tYW51YWxDbG9zZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYW51YWwgY29udHJvbHNcbiAgICovXG4gIG9wZW4oKSB7XG4gICAgdGhpcy5tYW51YWxPcGVuID0gdHJ1ZTtcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIHRoaXMuaGFuZGxlT3BlbigpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5tYW51YWxDbG9zZSA9IHRydWU7XG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuaGFuZGxlRm9jdXMoZXZlbnQpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5yZW1vdmUoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBzZWFyY2ggcXVlcnlcbiAgICovXG4gIHB1YmxpYyByZW1vdmUoZSkge1xuICAgIGlmIChlICYmIGUuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICB0aGlzLnF1ZXJ5ID0gJyc7XG4gICAgdGhpcy5pbnB1dENsZWFyZWQuZW1pdCgpO1xuICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlKHRoaXMucXVlcnkpO1xuICAgIHRoaXMuc2V0UGFuZWxTdGF0ZShlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGhpc3RvcnlMaXN0IHNlYXJjaFxuICAgKi9cbiAgaW5pdFNlYXJjaEhpc3RvcnkoKSB7XG4gICAgdGhpcy5pc0hpc3RvcnlMaXN0VmlzaWJsZSA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmhpc3RvcnlJZGVudGlmaWVyICYmICF0aGlzLnF1ZXJ5KSB7XG4gICAgICBjb25zdCBoaXN0b3J5ID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMuaGlzdG9yeUlkZW50aWZpZXJ9YCk7XG4gICAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgICB0aGlzLmlzSGlzdG9yeUxpc3RWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5maWx0ZXJlZExpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5oaXN0b3J5TGlzdCA9IGhpc3RvcnkgPyBKU09OLnBhcnNlKGhpc3RvcnkpIDogW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlzSGlzdG9yeUxpc3RWaXNpYmxlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXNIaXN0b3J5TGlzdFZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVPcGVuKCkge1xuICAgIGlmICh0aGlzLmlzT3BlbiB8fCB0aGlzLmlzT3BlbiAmJiAhdGhpcy5pc0xvYWRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gSWYgZGF0YSBleGlzdHNcbiAgICBpZiAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMub3ZlcmxheSA9IHRydWU7XG4gICAgICB0aGlzLmZpbHRlckxpc3QoKTtcbiAgICAgIHRoaXMub3BlbmVkLmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDbG9zZSgpIHtcbiAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIHRoaXMub3ZlcmxheSA9IGZhbHNlO1xuICAgIHRoaXMuZmlsdGVyZWRMaXN0ID0gW107XG4gICAgdGhpcy5zZWxlY3RlZElkeCA9IC0xO1xuICAgIHRoaXMubm90Rm91bmQgPSBmYWxzZTtcbiAgICB0aGlzLmlzSGlzdG9yeUxpc3RWaXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNsb3NlZC5lbWl0KCk7XG4gIH1cblxuICBoYW5kbGVGb2N1cyhlKSB7XG4gICAgLy90aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICBpZiAodGhpcy5pc0ZvY3VzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5pbnB1dEZvY3VzZWQuZW1pdChlKTtcbiAgICAvLyBpZiBkYXRhIGV4aXN0cyB0aGVuIG9wZW5cbiAgICBpZiAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0UGFuZWxTdGF0ZShldmVudCk7XG4gICAgfVxuICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZTtcbiAgfVxuXG4gIHNjcm9sbFRvRW5kKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzU2Nyb2xsVG9FbmQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JvbGxUb3AgPSB0aGlzLmZpbHRlcmVkTGlzdEVsZW1lbnQubmF0aXZlRWxlbWVudFxuICAgICAgLnNjcm9sbFRvcDtcbiAgICBjb25zdCBzY3JvbGxIZWlnaHQgPSB0aGlzLmZpbHRlcmVkTGlzdEVsZW1lbnQubmF0aXZlRWxlbWVudFxuICAgICAgLnNjcm9sbEhlaWdodDtcbiAgICBjb25zdCBlbGVtZW50SGVpZ2h0ID0gdGhpcy5maWx0ZXJlZExpc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnRcbiAgICAgIC5jbGllbnRIZWlnaHQ7XG4gICAgY29uc3QgYXRCb3R0b20gPSBzY3JvbGxIZWlnaHQgPT09IHNjcm9sbFRvcCArIGVsZW1lbnRIZWlnaHQ7XG4gICAgaWYgKGF0Qm90dG9tKSB7XG4gICAgICB0aGlzLnNjcm9sbGVkVG9FbmQuZW1pdCgpO1xuICAgICAgdGhpcy5pc1Njcm9sbFRvRW5kID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBrZXlib2FyZCBldmVudHNcbiAgICovXG4gIGluaXRFdmVudFN0cmVhbSgpIHtcbiAgICB0aGlzLmlucHV0S2V5VXAkID0gZnJvbUV2ZW50KFxuICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LCAna2V5dXAnXG4gICAgKS5waXBlKG1hcChcbiAgICAgIChlOiBhbnkpID0+IGVcbiAgICApKTtcblxuICAgIHRoaXMuaW5wdXRLZXlEb3duJCA9IGZyb21FdmVudChcbiAgICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudCxcbiAgICAgICdrZXlkb3duJ1xuICAgICkucGlwZShtYXAoXG4gICAgICAoZTogYW55KSA9PiBlXG4gICAgKSk7XG5cbiAgICB0aGlzLmxpc3RlbkV2ZW50U3RyZWFtKCk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIGtleWJvYXJkIGV2ZW50c1xuICAgKi9cbiAgbGlzdGVuRXZlbnRTdHJlYW0oKSB7XG4gICAgLy8ga2V5IHVwIGV2ZW50XG4gICAgdGhpcy5pbnB1dEtleVVwJFxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcihlID0+XG4gICAgICAgICAgIWlzQXJyb3dVcERvd24oZS5rZXlDb2RlKSAmJlxuICAgICAgICAgICFpc0VudGVyKGUua2V5Q29kZSkgJiZcbiAgICAgICAgICAhaXNFU0MoZS5rZXlDb2RlKSAmJlxuICAgICAgICAgICFpc1RhYihlLmtleUNvZGUpKSxcbiAgICAgICAgZGVib3VuY2VUaW1lKHRoaXMuZGVib3VuY2VUaW1lKVxuICAgICAgKS5zdWJzY3JpYmUoZSA9PiB7XG4gICAgICB0aGlzLm9uS2V5VXAoZSk7XG4gICAgfSk7XG5cbiAgICAvLyBjdXJzb3IgdXAgJiBkb3duXG4gICAgdGhpcy5pbnB1dEtleURvd24kLnBpcGUoZmlsdGVyKFxuICAgICAgZSA9PiBpc0Fycm93VXBEb3duKGUua2V5Q29kZSlcbiAgICApKS5zdWJzY3JpYmUoZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLm9uRm9jdXNJdGVtKGUpO1xuICAgIH0pO1xuXG4gICAgLy8gZW50ZXIga2V5dXBcbiAgICB0aGlzLmlucHV0S2V5VXAkLnBpcGUoZmlsdGVyKGUgPT4gaXNFbnRlcihlLmtleUNvZGUpKSkuc3Vic2NyaWJlKGUgPT4ge1xuICAgICAgLy90aGlzLm9uSGFuZGxlRW50ZXIoKTtcbiAgICB9KTtcblxuICAgIC8vIGVudGVyIGtleWRvd25cbiAgICB0aGlzLmlucHV0S2V5RG93biQucGlwZShmaWx0ZXIoZSA9PiBpc0VudGVyKGUua2V5Q29kZSkpKS5zdWJzY3JpYmUoZSA9PiB7XG4gICAgICB0aGlzLm9uSGFuZGxlRW50ZXIoKTtcbiAgICB9KTtcblxuICAgIC8vIEVTQ1xuICAgIHRoaXMuaW5wdXRLZXlVcCQucGlwZShcbiAgICAgIGZpbHRlcihlID0+IGlzRVNDKGUua2V5Q29kZSksXG4gICAgICAgIGRlYm91bmNlVGltZSgxMDApKVxuICAgICkuc3Vic2NyaWJlKGUgPT4ge1xuICAgICAgdGhpcy5vbkVzYygpO1xuICAgIH0pO1xuXG4gICAgLy8gZGVsZXRlXG4gICAgdGhpcy5pbnB1dEtleURvd24kLnBpcGUoXG4gICAgICBmaWx0ZXIoZSA9PiBpc0JhY2tzcGFjZShlLmtleUNvZGUpIHx8IGlzRGVsZXRlKGUua2V5Q29kZSkpXG4gICAgKS5zdWJzY3JpYmUoZSA9PiB7XG4gICAgICB0aGlzLm9uRGVsZXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogb24ga2V5dXAgPT0gd2hlbiBpbnB1dCBjaGFuZ2VkXG4gICAqIEBwYXJhbSBlIGV2ZW50XG4gICAqL1xuICBvbktleVVwKGUpIHtcbiAgICB0aGlzLm5vdEZvdW5kID0gZmFsc2U7IC8vIHNlYXJjaCByZXN1bHRzIGFyZSB1bmtub3duIHdoaWxlIHR5cGluZ1xuICAgIC8vIGlmIGlucHV0IGlzIGVtcHR5XG4gICAgaWYgKCF0aGlzLnF1ZXJ5KSB7XG4gICAgICB0aGlzLm5vdEZvdW5kID0gZmFsc2U7XG4gICAgICB0aGlzLmlucHV0Q2hhbmdlZC5lbWl0KGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgIHRoaXMuaW5wdXRDbGVhcmVkLmVtaXQoKTtcbiAgICAgIC8vdGhpcy5maWx0ZXJMaXN0KCk7XG4gICAgICB0aGlzLnNldFBhbmVsU3RhdGUoZSk7XG4gICAgfVxuICAgIC8vIGlmIHF1ZXJ5ID49IHRvIG1pblF1ZXJ5TGVuZ3RoXG4gICAgaWYgKHRoaXMucXVlcnkubGVuZ3RoID49IHRoaXMubWluUXVlcnlMZW5ndGgpIHtcbiAgICAgIHRoaXMuaW5wdXRDaGFuZ2VkLmVtaXQoZS50YXJnZXQudmFsdWUpO1xuICAgICAgdGhpcy5maWx0ZXJMaXN0KCk7XG5cbiAgICAgIC8vIElmIG5vIHJlc3VsdHMgZm91bmRcbiAgICAgIGlmICghdGhpcy5maWx0ZXJlZExpc3QubGVuZ3RoICYmICF0aGlzLmlzTG9hZGluZykge1xuICAgICAgICB0aGlzLm5vdEZvdW5kVGV4dCA/IHRoaXMubm90Rm91bmQgPSB0cnVlIDogdGhpcy5ub3RGb3VuZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIEtleWJvYXJkIGFycm93IHRvcCBhbmQgYXJyb3cgYm90dG9tXG4gICAqIEBwYXJhbSBlIGV2ZW50XG4gICAqL1xuICBvbkZvY3VzSXRlbShlKSB7XG4gICAgLy8gbW92ZSBhcnJvdyB1cCBhbmQgZG93biBvbiBmaWx0ZXJlZExpc3Qgb3IgaGlzdG9yeUxpc3RcbiAgICBpZiAoIXRoaXMuaGlzdG9yeUxpc3QubGVuZ3RoIHx8ICF0aGlzLmlzSGlzdG9yeUxpc3RWaXNpYmxlKSB7XG4gICAgICAvLyBmaWx0ZXJlZExpc3RcbiAgICAgIGNvbnN0IHRvdGFsTnVtSXRlbSA9IHRoaXMuZmlsdGVyZWRMaXN0Lmxlbmd0aDtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMuc2VsZWN0ZWRJZHg7XG4gICAgICAgIHN1bSA9ICh0aGlzLnNlbGVjdGVkSWR4ID09PSBudWxsKSA/IDAgOiBzdW0gKyAxO1xuICAgICAgICB0aGlzLnNlbGVjdGVkSWR4ID0gKHRvdGFsTnVtSXRlbSArIHN1bSkgJSB0b3RhbE51bUl0ZW07XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Gb2N1c2VkSXRlbSh0aGlzLnNlbGVjdGVkSWR4KTtcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZElkeCA9PSAtMSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJZHggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJZHggPSAodG90YWxOdW1JdGVtICsgdGhpcy5zZWxlY3RlZElkeCAtIDEpICUgdG90YWxOdW1JdGVtO1xuICAgICAgICB0aGlzLnNjcm9sbFRvRm9jdXNlZEl0ZW0odGhpcy5zZWxlY3RlZElkeCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGhpc3RvcnlMaXN0XG4gICAgICBjb25zdCB0b3RhbE51bUl0ZW0gPSB0aGlzLmhpc3RvcnlMaXN0Lmxlbmd0aDtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMuc2VsZWN0ZWRJZHg7XG4gICAgICAgIHN1bSA9ICh0aGlzLnNlbGVjdGVkSWR4ID09PSBudWxsKSA/IDAgOiBzdW0gKyAxO1xuICAgICAgICB0aGlzLnNlbGVjdGVkSWR4ID0gKHRvdGFsTnVtSXRlbSArIHN1bSkgJSB0b3RhbE51bUl0ZW07XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Gb2N1c2VkSXRlbSh0aGlzLnNlbGVjdGVkSWR4KTtcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZElkeCA9PSAtMSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJZHggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJZHggPSAodG90YWxOdW1JdGVtICsgdGhpcy5zZWxlY3RlZElkeCAtIDEpICUgdG90YWxOdW1JdGVtO1xuICAgICAgICB0aGlzLnNjcm9sbFRvRm9jdXNlZEl0ZW0odGhpcy5zZWxlY3RlZElkeCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNjcm9sbCB0byBmb2N1c2VkIGl0ZW1cbiAgICogKiBAcGFyYW0gaW5kZXhcbiAgICovXG4gIHNjcm9sbFRvRm9jdXNlZEl0ZW0oaW5kZXgpIHtcbiAgICBsZXQgbGlzdEVsZW1lbnQgPSBudWxsO1xuICAgIC8vIERlZmluZSBsaXN0IGVsZW1lbnRcbiAgICBpZiAoIXRoaXMuaGlzdG9yeUxpc3QubGVuZ3RoIHx8ICF0aGlzLmlzSGlzdG9yeUxpc3RWaXNpYmxlKSB7XG4gICAgICAvLyBmaWx0ZXJlZExpc3QgZWxlbWVudFxuICAgICAgbGlzdEVsZW1lbnQgPSB0aGlzLmZpbHRlcmVkTGlzdEVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaGlzdG9yeUxpc3QgZWxlbWVudFxuICAgICAgbGlzdEVsZW1lbnQgPSB0aGlzLmhpc3RvcnlMaXN0RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobGlzdEVsZW1lbnQuY2hpbGROb2RlcykuZmlsdGVyKChub2RlOiBhbnkpID0+IHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIC8vIGlmIG5vZGUgaXMgZWxlbWVudFxuICAgICAgICByZXR1cm4gbm9kZS5jbGFzc05hbWUuaW5jbHVkZXMoJ2l0ZW0nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdEhlaWdodCA9IGxpc3RFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gaXRlbXNbaW5kZXhdLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCB2aXNpYmxlVG9wID0gbGlzdEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgIGNvbnN0IHZpc2libGVCb3R0b20gPSBsaXN0RWxlbWVudC5zY3JvbGxUb3AgKyBsaXN0SGVpZ2h0IC0gaXRlbUhlaWdodDtcbiAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IGl0ZW1zW2luZGV4XS5vZmZzZXRUb3A7XG5cbiAgICBpZiAodGFyZ2V0UG9zaXRpb24gPCB2aXNpYmxlVG9wKSB7XG4gICAgICBsaXN0RWxlbWVudC5zY3JvbGxUb3AgPSB0YXJnZXRQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0UG9zaXRpb24gPiB2aXNpYmxlQm90dG9tKSB7XG4gICAgICBsaXN0RWxlbWVudC5zY3JvbGxUb3AgPSB0YXJnZXRQb3NpdGlvbiAtIGxpc3RIZWlnaHQgKyBpdGVtSGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3QgaXRlbSBvbiBlbnRlciBjbGlja1xuICAgKi9cbiAgb25IYW5kbGVFbnRlcigpIHtcbiAgICAvLyBjbGljayBlbnRlciB0byBjaG9vc2UgaXRlbSBmcm9tIGZpbHRlcmVkTGlzdCBvciBoaXN0b3J5TGlzdFxuICAgIGlmICh0aGlzLnNlbGVjdGVkSWR4ID4gLTEpIHtcbiAgICAgIGlmICghdGhpcy5oaXN0b3J5TGlzdC5sZW5ndGggfHwgIXRoaXMuaXNIaXN0b3J5TGlzdFZpc2libGUpIHtcbiAgICAgICAgLy8gZmlsdGVyZWRMaXN0XG4gICAgICAgIHRoaXMucXVlcnkgPSAhdGhpcy5pc1R5cGUodGhpcy5maWx0ZXJlZExpc3RbdGhpcy5zZWxlY3RlZElkeF0pXG4gICAgICAgICAgPyB0aGlzLmZpbHRlcmVkTGlzdFt0aGlzLnNlbGVjdGVkSWR4XVt0aGlzLnNlYXJjaEtleXdvcmRdXG4gICAgICAgICAgOiB0aGlzLmZpbHRlcmVkTGlzdFt0aGlzLnNlbGVjdGVkSWR4XTtcblxuICAgICAgICB0aGlzLnNhdmVIaXN0b3J5KHRoaXMuZmlsdGVyZWRMaXN0W3RoaXMuc2VsZWN0ZWRJZHhdKTtcbiAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5maWx0ZXJlZExpc3RbdGhpcy5zZWxlY3RlZElkeF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaGlzdG9yeUxpc3RcbiAgICAgICAgdGhpcy5xdWVyeSA9ICF0aGlzLmlzVHlwZSh0aGlzLmhpc3RvcnlMaXN0W3RoaXMuc2VsZWN0ZWRJZHhdKVxuICAgICAgICAgID8gdGhpcy5oaXN0b3J5TGlzdFt0aGlzLnNlbGVjdGVkSWR4XVt0aGlzLnNlYXJjaEtleXdvcmRdXG4gICAgICAgICAgOiB0aGlzLmhpc3RvcnlMaXN0W3RoaXMuc2VsZWN0ZWRJZHhdO1xuICAgICAgICB0aGlzLnNhdmVIaXN0b3J5KHRoaXMuaGlzdG9yeUxpc3RbdGhpcy5zZWxlY3RlZElkeF0pO1xuICAgICAgICB0aGlzLnNlbGVjdCh0aGlzLmhpc3RvcnlMaXN0W3RoaXMuc2VsZWN0ZWRJZHhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pc0hpc3RvcnlMaXN0VmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFc2MgY2xpY2tcbiAgICovXG4gIG9uRXNjKCkge1xuICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBjbGlja1xuICAgKi9cbiAgb25EZWxldGUoKSB7XG4gICAgLy8gcGFuZWwgaXMgb3BlbiBvbiBkZWxldGVcbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZWxlY3QgaXRlbSB0byBzYXZlIGluIGxvY2FsU3RvcmFnZVxuICAgKiBAcGFyYW0gc2VsZWN0ZWRcbiAgICovXG4gIHNhdmVIaXN0b3J5KHNlbGVjdGVkKSB7XG4gICAgaWYgKHRoaXMuaGlzdG9yeUlkZW50aWZpZXIpIHtcbiAgICAgIC8vIGNoZWNrIGlmIHNlbGVjdGVkIGl0ZW0gZXhpc3RzIGluIGhpc3RvcnlMaXN0XG4gICAgICBpZiAoIXRoaXMuaGlzdG9yeUxpc3Quc29tZSgoaXRlbSkgPT4gIXRoaXMuaXNUeXBlKGl0ZW0pXG4gICAgICAgID8gaXRlbVt0aGlzLnNlYXJjaEtleXdvcmRdID09IHNlbGVjdGVkW3RoaXMuc2VhcmNoS2V5d29yZF0gOiBpdGVtID09IHNlbGVjdGVkKSkge1xuICAgICAgICB0aGlzLnNhdmVIaXN0b3J5VG9Mb2NhbFN0b3JhZ2UoW3NlbGVjdGVkLCAuLi50aGlzLmhpc3RvcnlMaXN0XSk7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgaXRlbXMgZG9uJ3QgZXhjZWVkIG1heCBhbGxvd2VkIG51bWJlclxuICAgICAgICBpZiAodGhpcy5oaXN0b3J5TGlzdC5sZW5ndGggPj0gdGhpcy5oaXN0b3J5TGlzdE1heE51bWJlcikge1xuICAgICAgICAgIHRoaXMuaGlzdG9yeUxpc3Quc3BsaWNlKHRoaXMuaGlzdG9yeUxpc3QubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgICAgdGhpcy5zYXZlSGlzdG9yeVRvTG9jYWxTdG9yYWdlKFtzZWxlY3RlZCwgLi4udGhpcy5oaXN0b3J5TGlzdF0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBzZWxlY3RlZCBpdGVtIGV4aXN0cyBpbiBoaXN0b3J5TGlzdCBzd2FwIHRvIHRvcCBpbiBhcnJheVxuICAgICAgICBpZiAoIXRoaXMuaXNUeXBlKHNlbGVjdGVkKSkge1xuICAgICAgICAgIC8vIG9iamVjdCBsb2dpY1xuICAgICAgICAgIGNvbnN0IGNvcGllZEhpc3RvcnlMaXN0ID0gdGhpcy5oaXN0b3J5TGlzdC5zbGljZSgpOyAvLyBjb3B5IG9yaWdpbmFsIGhpc3RvcnlMaXN0IGFycmF5XG4gICAgICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IGNvcGllZEhpc3RvcnlMaXN0Lm1hcCgoaXRlbSkgPT4gaXRlbVt0aGlzLnNlYXJjaEtleXdvcmRdKS5pbmRleE9mKHNlbGVjdGVkW3RoaXMuc2VhcmNoS2V5d29yZF0pO1xuICAgICAgICAgIGNvcGllZEhpc3RvcnlMaXN0LnNwbGljZShzZWxlY3RlZEluZGV4LCAxKTtcbiAgICAgICAgICBjb3BpZWRIaXN0b3J5TGlzdC5zcGxpY2UoMCwgMCwgc2VsZWN0ZWQpO1xuICAgICAgICAgIHRoaXMuc2F2ZUhpc3RvcnlUb0xvY2FsU3RvcmFnZShbLi4uY29waWVkSGlzdG9yeUxpc3RdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzdHJpbmcgbG9naWNcbiAgICAgICAgICBjb25zdCBjb3BpZWRIaXN0b3J5TGlzdCA9IHRoaXMuaGlzdG9yeUxpc3Quc2xpY2UoKTsgLy8gY29weSBvcmlnaW5hbCBoaXN0b3J5TGlzdCBhcnJheVxuICAgICAgICAgIGNvcGllZEhpc3RvcnlMaXN0LnNwbGljZSh0aGlzLmhpc3RvcnlMaXN0LmluZGV4T2Yoc2VsZWN0ZWQpLCAxKTtcbiAgICAgICAgICBjb3BpZWRIaXN0b3J5TGlzdC5zcGxpY2UoMCwgMCwgc2VsZWN0ZWQpO1xuICAgICAgICAgIHRoaXMuc2F2ZUhpc3RvcnlUb0xvY2FsU3RvcmFnZShbLi4uY29waWVkSGlzdG9yeUxpc3RdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIGl0ZW0gaW4gbG9jYWxTdG9yYWdlXG4gICAqIEBwYXJhbSBzZWxlY3RlZFxuICAgKi9cbiAgc2F2ZUhpc3RvcnlUb0xvY2FsU3RvcmFnZShzZWxlY3RlZCkge1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgIGAke3RoaXMuaGlzdG9yeUlkZW50aWZpZXJ9YCxcbiAgICAgIEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGl0ZW0gZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICogQHBhcmFtIGluZGV4XG4gICAqIEBwYXJhbSBlIGV2ZW50XG4gICAqL1xuICByZW1vdmVIaXN0b3J5SXRlbShpbmRleCwgZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5oaXN0b3J5TGlzdCA9IHRoaXMuaGlzdG9yeUxpc3QuZmlsdGVyKCh2LCBpKSA9PiBpICE9PSBpbmRleCk7XG4gICAgdGhpcy5zYXZlSGlzdG9yeVRvTG9jYWxTdG9yYWdlKHRoaXMuaGlzdG9yeUxpc3QpO1xuICAgIGlmICh0aGlzLmhpc3RvcnlMaXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYCR7dGhpcy5oaXN0b3J5SWRlbnRpZmllcn1gKTtcbiAgICAgIHRoaXMuZmlsdGVyTGlzdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBsb2NhbFN0b3JhZ2VcbiAgICogQHBhcmFtIGUgZXZlbnRcbiAgICovXG4gIHJlc2V0SGlzdG9yeUxpc3QoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5oaXN0b3J5TGlzdCA9IFtdO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShgJHt0aGlzLmhpc3RvcnlJZGVudGlmaWVyfWApO1xuICAgIHRoaXMuZmlsdGVyTGlzdCgpO1xuICB9XG59XG4iXX0=