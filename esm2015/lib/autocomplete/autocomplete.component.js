/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ContentChild, ElementRef, EventEmitter, forwardRef, Input, Output, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
/** *
 * Keyboard events
  @type {?} */
const isArrowUp = keyCode => keyCode === 38;
const ɵ0 = isArrowUp;
/** @type {?} */
const isArrowDown = keyCode => keyCode === 40;
const ɵ1 = isArrowDown;
/** @type {?} */
const isArrowUpDown = keyCode => isArrowUp(keyCode) || isArrowDown(keyCode);
const ɵ2 = isArrowUpDown;
/** @type {?} */
const isEnter = keyCode => keyCode === 13;
const ɵ3 = isEnter;
/** @type {?} */
const isBackspace = keyCode => keyCode === 8;
const ɵ4 = isBackspace;
/** @type {?} */
const isDelete = keyCode => keyCode === 46;
const ɵ5 = isDelete;
/** @type {?} */
const isESC = keyCode => keyCode === 27;
const ɵ6 = isESC;
/** @type {?} */
const isTab = keyCode => keyCode === 9;
const ɵ7 = isTab;
export class AutocompleteComponent {
    /**
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(elementRef, renderer) {
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
        this.propagateChange = () => {
        };
        this.elementRef = elementRef;
    }
    /**
     * Writes a new value from the form model into the view,
     * Updates model
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.query = value;
    }
    /**
     * Registers a handler that is called when something in the view has changed
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    /**
     * Registers a handler specifically for when a control receives a touch event
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
    }
    /**
     * Event that is called when the value of an input element is changed
     * @param {?} event
     * @return {?}
     */
    onChange(event) {
        this.propagateChange(event.target.value);
    }
    /**
     * Event that is called when the control status changes to or from DISABLED
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.handleScroll();
        this.initEventStream();
        this.setInitialValue(this.initialValue);
    }
    /**
     * Set initial value
     * @param {?} value
     * @return {?}
     */
    setInitialValue(value) {
        if (this.initialValue) {
            this.select(value);
        }
    }
    /**
     * Update search results
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes && changes["data"] &&
            Array.isArray(changes["data"].currentValue)) {
            this.handleItemsChange();
            if (!changes["data"].firstChange && this.isFocused) {
                this.handleOpen();
            }
        }
    }
    /**
     * Items change
     * @return {?}
     */
    handleItemsChange() {
        this.isScrollToEnd = false;
        if (!this.isOpen) {
            return;
        }
        this.filteredList = this.data;
        this.notFound = !this.filteredList || this.filteredList.length === 0;
    }
    /**
     * Filter data
     * @return {?}
     */
    filterList() {
        this.selectedIdx = -1;
        this.initSearchHistory();
        if (this.query != null && this.data) {
            this.toHighlight = this.query;
            this.filteredList = this.data.filter((item) => {
                if (typeof item === 'string') {
                    // string logic, check equality of strings
                    return item.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                }
                else if (typeof item === 'object' && item.constructor === Object) {
                    // object logic, check property equality
                    return item[this.searchKeyword].toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                }
            });
        }
        else {
            this.notFound = false;
        }
    }
    /**
     * Check type of item in the list.
     * @param {?} item
     * @return {?}
     */
    isType(item) {
        return typeof item === 'string';
    }
    /**
     * Select item in the list.
     * @param {?} item
     * @return {?}
     */
    select(item) {
        this.query = !this.isType(item) ? item[this.searchKeyword] : item;
        this.isOpen = true;
        this.overlay = false;
        this.selected.emit(item);
        this.propagateChange(item);
        if (this.initialValue) {
            /** @type {?} */
            const history = window.localStorage.getItem(`${this.historyIdentifier}`);
            if (history) {
                /** @type {?} */
                let existingHistory = JSON.parse(localStorage[`${this.historyIdentifier}`]);
                if (!(existingHistory instanceof Array))
                    existingHistory = [];
                // check if selected item exists in existingHistory
                if (!existingHistory.some((existingItem) => !this.isType(existingItem)
                    ? existingItem[this.searchKeyword] == item[this.searchKeyword] : existingItem == item)) {
                    existingHistory.unshift(item);
                    localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(existingHistory));
                    // check if items don't exceed max allowed number
                    if (existingHistory.length >= this.historyListMaxNumber) {
                        existingHistory.splice(existingHistory.length - 1, 1);
                        localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(existingHistory));
                    }
                }
                else {
                    // if selected item exists in existingHistory swap to top in array
                    if (!this.isType(item)) {
                        /** @type {?} */
                        const copiedExistingHistory = existingHistory.slice();
                        /** @type {?} */
                        const selectedIndex = copiedExistingHistory.map((el) => el[this.searchKeyword]).indexOf(item[this.searchKeyword]);
                        copiedExistingHistory.splice(selectedIndex, 1);
                        copiedExistingHistory.splice(0, 0, item);
                        localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(copiedExistingHistory));
                    }
                    else {
                        /** @type {?} */
                        const copiedExistingHistory = existingHistory.slice(); // copy original existingHistory array
                        copiedExistingHistory.splice(copiedExistingHistory.indexOf(item), 1);
                        copiedExistingHistory.splice(0, 0, item);
                        localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(copiedExistingHistory));
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
    }
    /**
     * Document click
     * @param {?} e event
     * @return {?}
     */
    handleClick(e) {
        /** @type {?} */
        let clickedComponent = e.target;
        /** @type {?} */
        let inside = false;
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
    }
    /**
     * Handle body overlay
     * @return {?}
     */
    handleOverlay() {
        this.overlay = false;
    }
    /**
     * Scroll items
     * @return {?}
     */
    handleScroll() {
        this.renderer.listen(this.filteredListElement.nativeElement, 'scroll', () => {
            this.scrollToEnd();
        });
    }
    /**
     * Define panel state
     * @param {?} event
     * @return {?}
     */
    setPanelState(event) {
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
    }
    /**
     * Manual controls
     * @return {?}
     */
    open() {
        this.manualOpen = true;
        this.isOpen = false;
        this.handleOpen();
    }
    /**
     * @return {?}
     */
    close() {
        this.manualClose = true;
        this.isOpen = true;
        this.handleClose();
    }
    /**
     * @return {?}
     */
    focus() {
        this.handleFocus(event);
    }
    /**
     * @return {?}
     */
    clear() {
        this.remove(event);
    }
    /**
     * Remove search query
     * @param {?} e
     * @return {?}
     */
    remove(e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        this.query = '';
        this.inputCleared.emit();
        this.propagateChange(this.query);
        this.setPanelState(e);
    }
    /**
     * Initialize historyList search
     * @return {?}
     */
    initSearchHistory() {
        this.isHistoryListVisible = false;
        if (this.historyIdentifier && !this.query) {
            /** @type {?} */
            const history = window.localStorage.getItem(`${this.historyIdentifier}`);
            if (history) {
                this.isHistoryListVisible = true;
                this.filteredList = [];
                this.historyList = history ? JSON.parse(history) : [];
            }
            else {
                this.isHistoryListVisible = false;
            }
        }
        else {
            this.isHistoryListVisible = false;
        }
    }
    /**
     * @return {?}
     */
    handleOpen() {
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
    }
    /**
     * @return {?}
     */
    handleClose() {
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
    }
    /**
     * @param {?} e
     * @return {?}
     */
    handleFocus(e) {
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
    }
    /**
     * @return {?}
     */
    scrollToEnd() {
        if (this.isScrollToEnd) {
            return;
        }
        /** @type {?} */
        const scrollTop = this.filteredListElement.nativeElement
            .scrollTop;
        /** @type {?} */
        const scrollHeight = this.filteredListElement.nativeElement
            .scrollHeight;
        /** @type {?} */
        const elementHeight = this.filteredListElement.nativeElement
            .clientHeight;
        /** @type {?} */
        const atBottom = scrollHeight === scrollTop + elementHeight;
        if (atBottom) {
            this.scrolledToEnd.emit();
            this.isScrollToEnd = true;
        }
    }
    /**
     * Initialize keyboard events
     * @return {?}
     */
    initEventStream() {
        this.inputKeyUp$ = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(map((e) => e));
        this.inputKeyDown$ = fromEvent(this.searchInput.nativeElement, 'keydown').pipe(map((e) => e));
        this.listenEventStream();
    }
    /**
     * Listen keyboard events
     * @return {?}
     */
    listenEventStream() {
        // key up event
        this.inputKeyUp$
            .pipe(filter(e => !isArrowUpDown(e.keyCode) &&
            !isEnter(e.keyCode) &&
            !isESC(e.keyCode) &&
            !isTab(e.keyCode)), debounceTime(this.debounceTime)).subscribe(e => {
            this.onKeyUp(e);
        });
        // cursor up & down
        this.inputKeyDown$.pipe(filter(e => isArrowUpDown(e.keyCode))).subscribe(e => {
            e.preventDefault();
            this.onFocusItem(e);
        });
        // enter keyup
        this.inputKeyUp$.pipe(filter(e => isEnter(e.keyCode))).subscribe(e => {
            //this.onHandleEnter();
        });
        // enter keydown
        this.inputKeyDown$.pipe(filter(e => isEnter(e.keyCode))).subscribe(e => {
            this.onHandleEnter();
        });
        // ESC
        this.inputKeyUp$.pipe(filter(e => isESC(e.keyCode), debounceTime(100))).subscribe(e => {
            this.onEsc();
        });
        // delete
        this.inputKeyDown$.pipe(filter(e => isBackspace(e.keyCode) || isDelete(e.keyCode))).subscribe(e => {
            this.onDelete();
        });
    }
    /**
     * on keyup == when input changed
     * @param {?} e event
     * @return {?}
     */
    onKeyUp(e) {
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
    }
    /**
     * Keyboard arrow top and arrow bottom
     * @param {?} e event
     * @return {?}
     */
    onFocusItem(e) {
        // move arrow up and down on filteredList or historyList
        if (!this.historyList.length || !this.isHistoryListVisible) {
            /** @type {?} */
            const totalNumItem = this.filteredList.length;
            if (e.key === 'ArrowDown') {
                /** @type {?} */
                let sum = this.selectedIdx;
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
            const totalNumItem = this.historyList.length;
            if (e.key === 'ArrowDown') {
                /** @type {?} */
                let sum = this.selectedIdx;
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
    }
    /**
     * Scroll to focused item
     * * \@param index
     * @param {?} index
     * @return {?}
     */
    scrollToFocusedItem(index) {
        /** @type {?} */
        let listElement = null;
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
        const items = Array.prototype.slice.call(listElement.childNodes).filter((node) => {
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
        const listHeight = listElement.offsetHeight;
        /** @type {?} */
        const itemHeight = items[index].offsetHeight;
        /** @type {?} */
        const visibleTop = listElement.scrollTop;
        /** @type {?} */
        const visibleBottom = listElement.scrollTop + listHeight - itemHeight;
        /** @type {?} */
        const targetPosition = items[index].offsetTop;
        if (targetPosition < visibleTop) {
            listElement.scrollTop = targetPosition;
        }
        if (targetPosition > visibleBottom) {
            listElement.scrollTop = targetPosition - listHeight + itemHeight;
        }
    }
    /**
     * Select item on enter click
     * @return {?}
     */
    onHandleEnter() {
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
    }
    /**
     * Esc click
     * @return {?}
     */
    onEsc() {
        this.searchInput.nativeElement.blur();
        this.handleClose();
    }
    /**
     * Delete click
     * @return {?}
     */
    onDelete() {
        // panel is open on delete
        this.isOpen = true;
    }
    /**
     * Select item to save in localStorage
     * @param {?} selected
     * @return {?}
     */
    saveHistory(selected) {
        if (this.historyIdentifier) {
            // check if selected item exists in historyList
            if (!this.historyList.some((item) => !this.isType(item)
                ? item[this.searchKeyword] == selected[this.searchKeyword] : item == selected)) {
                this.saveHistoryToLocalStorage([selected, ...this.historyList]);
                // check if items don't exceed max allowed number
                if (this.historyList.length >= this.historyListMaxNumber) {
                    this.historyList.splice(this.historyList.length - 1, 1);
                    this.saveHistoryToLocalStorage([selected, ...this.historyList]);
                }
            }
            else {
                // if selected item exists in historyList swap to top in array
                if (!this.isType(selected)) {
                    /** @type {?} */
                    const copiedHistoryList = this.historyList.slice();
                    /** @type {?} */
                    const selectedIndex = copiedHistoryList.map((item) => item[this.searchKeyword]).indexOf(selected[this.searchKeyword]);
                    copiedHistoryList.splice(selectedIndex, 1);
                    copiedHistoryList.splice(0, 0, selected);
                    this.saveHistoryToLocalStorage([...copiedHistoryList]);
                }
                else {
                    /** @type {?} */
                    const copiedHistoryList = this.historyList.slice(); // copy original historyList array
                    copiedHistoryList.splice(this.historyList.indexOf(selected), 1);
                    copiedHistoryList.splice(0, 0, selected);
                    this.saveHistoryToLocalStorage([...copiedHistoryList]);
                }
            }
        }
    }
    /**
     * Save item in localStorage
     * @param {?} selected
     * @return {?}
     */
    saveHistoryToLocalStorage(selected) {
        window.localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(selected));
    }
    /**
     * Remove item from localStorage
     * @param {?} index
     * @param {?} e event
     * @return {?}
     */
    removeHistoryItem(index, e) {
        e.stopPropagation();
        this.historyList = this.historyList.filter((v, i) => i !== index);
        this.saveHistoryToLocalStorage(this.historyList);
        if (this.historyList.length == 0) {
            window.localStorage.removeItem(`${this.historyIdentifier}`);
            this.filterList();
        }
    }
    /**
     * Reset localStorage
     * @param {?} e event
     * @return {?}
     */
    resetHistoryList(e) {
        e.stopPropagation();
        this.historyList = [];
        window.localStorage.removeItem(`${this.historyIdentifier}`);
        this.filterList();
    }
}
AutocompleteComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-autocomplete',
                template: `<div class="autocomplete-container"
     [ngClass]="{ 'active': isOpen}">
  <div class="input-container">
    <input #searchInput type="text" placeholder={{placeHolder}}
           [(ngModel)]=query
           (input)="onChange($event)"
           (focus)=handleFocus($event)
           [disabled]="disabled">
    <div class="x" *ngIf="query && !isLoading" (click)="remove($event)">
      <i class="material-icons">close</i>
    </div>
    <!--Loading mask-->
    <div class="sk-fading-circle" *ngIf="isLoading">
      <div class="sk-circle1 sk-circle"></div>
      <div class="sk-circle2 sk-circle"></div>
      <div class="sk-circle3 sk-circle"></div>
      <div class="sk-circle4 sk-circle"></div>
      <div class="sk-circle5 sk-circle"></div>
      <div class="sk-circle6 sk-circle"></div>
      <div class="sk-circle7 sk-circle"></div>
      <div class="sk-circle8 sk-circle"></div>
      <div class="sk-circle9 sk-circle"></div>
      <div class="sk-circle10 sk-circle"></div>
      <div class="sk-circle11 sk-circle"></div>
      <div class="sk-circle12 sk-circle"></div>
    </div>
  </div>

  <!--FilteredList items-->
  <div class="suggestions-container"
       [ngClass]="{ 'is-hidden': isHistoryListVisible, 'is-visible': !isHistoryListVisible}">
    <ul #filteredListElement>
      <li *ngFor="let item of filteredList; let idx = index" class="item">
        <!--string logic-->
        <div [class.complete-selected]="idx === selectedIdx" *ngIf='isType(item)'
             (click)="select(item)">
          <ng-container
            *ngTemplateOutlet="itemTemplate;  context: { $implicit: item | highlight: toHighlight }">
          </ng-container>
        </div>
        <!--object logic-->
        <div [class.complete-selected]="idx === selectedIdx" *ngIf='!isType(item)'
             (click)="select(item)">
          <ng-container
            *ngTemplateOutlet="itemTemplate; context: { $implicit: item | highlight: toHighlight : searchKeyword }">
          </ng-container>
        </div>

      </li>
    </ul>
  </div>

  <!--HistoryList items-->
  <div class="suggestions-container"
       [ngClass]="{ 'is-hidden': !isHistoryListVisible, 'is-visible': isHistoryListVisible}">
    <!--HistoryList heading-->
    <div class="history-heading" *ngIf="historyList.length > 0 && historyHeading">
      <div class="text">{{historyHeading}}</div>
      <div class="x" (click)="resetHistoryList($event)">
        <i class="material-icons">delete</i>
      </div>
    </div>

    <ul #historyListElement>
      <li *ngFor="let item of historyList; let idx = index" class="item">
        <!--string logic-->
        <div [class.complete-selected]="idx === selectedIdx" *ngIf='isType(item)' (click)="select(item)">
          <ng-container
            *ngTemplateOutlet="itemTemplate;  context: { $implicit: item }">
          </ng-container>
        </div>
        <!--object logic-->
        <div [class.complete-selected]="idx === selectedIdx" *ngIf='!isType(item)' (click)="select(item)">
          <ng-container
            *ngTemplateOutlet="itemTemplate; context: { $implicit: item }">
          </ng-container>
        </div>
        <div class="x" (click)="removeHistoryItem(idx, $event)">
          <i class="material-icons">close</i>
        </div>
      </li>
    </ul>
  </div>

  <!--Not found-->
  <div class="not-found" *ngIf="isLoading ? !isLoading && notFound : notFound">
    <ng-container
      *ngTemplateOutlet="notFoundTemplate;  context: { $implicit: notFoundText  }">
    </ng-container>
  </div>
</div>
<div class="overlay" *ngIf="overlay" (click)="handleOverlay()"></div>
`,
                styles: [`@import url(https://fonts.googleapis.com/icon?family=Material+Icons);.ng-autocomplete{width:600px}.autocomplete-container{box-shadow:0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12);position:relative;overflow:visible;height:40px}.autocomplete-container .input-container input{font-size:14px;box-sizing:border-box;border:none;box-shadow:none;outline:0;background-color:#fff;color:rgba(0,0,0,.87);width:100%;padding:0 15px;line-height:40px;height:40px}.autocomplete-container .input-container input:disabled{background-color:#eee;color:#666}.autocomplete-container .input-container .x{position:absolute;right:10px;margin:auto;cursor:pointer;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.autocomplete-container .input-container .x i{color:rgba(0,0,0,.54);font-size:22px;vertical-align:middle}.autocomplete-container .suggestions-container{position:absolute;width:100%;background:#fff;height:auto;box-shadow:0 2px 5px rgba(0,0,0,.25);box-sizing:border-box}.autocomplete-container .suggestions-container ul{padding:0;margin:0;max-height:240px;overflow-y:auto}.autocomplete-container .suggestions-container ul li{position:relative;list-style:none;padding:0;margin:0;cursor:pointer}.autocomplete-container .suggestions-container ul li a{padding:14px 15px;display:block;text-decoration:none;cursor:pointer;color:rgba(0,0,0,.87);font-size:15px}.autocomplete-container .suggestions-container .complete-selected,.autocomplete-container .suggestions-container ul li:hover{background-color:rgba(158,158,158,.18)}.autocomplete-container .suggestions-container .history-heading{position:relative;padding:10px 15px;border:1px solid #f1f1f1}.autocomplete-container .suggestions-container .history-heading .text{font-size:.85em}.autocomplete-container .suggestions-container .x{position:absolute;right:10px;margin:auto;cursor:pointer;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.autocomplete-container .suggestions-container .x i{color:rgba(0,0,0,.54);font-size:18px;vertical-align:middle}.autocomplete-container .suggestions-container.is-hidden{visibility:hidden}.autocomplete-container .suggestions-container.is-visible{visibility:visible}.autocomplete-container .not-found{padding:0 .75em;border:1px solid #f1f1f1;background:#fff}.autocomplete-container .not-found div{padding:.4em 0;font-size:.95em;line-height:1.4;border-bottom:1px solid rgba(230,230,230,.7)}.autocomplete-container.active{z-index:999}.highlight{font-weight:700}.overlay{position:absolute;background-color:transparent;top:0;right:0;bottom:0;left:0;z-index:50}input[type=text]::-ms-clear{display:none}.sk-fading-circle{width:20px;height:20px;position:absolute;right:10px;top:0;bottom:0;margin:auto}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0}.sk-fading-circle .sk-circle:before{content:'';display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;-webkit-animation:1.2s ease-in-out infinite both sk-circleFadeDelay;animation:1.2s ease-in-out infinite both sk-circleFadeDelay}.sk-fading-circle .sk-circle2{-webkit-transform:rotate(30deg);transform:rotate(30deg)}.sk-fading-circle .sk-circle3{-webkit-transform:rotate(60deg);transform:rotate(60deg)}.sk-fading-circle .sk-circle4{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.sk-fading-circle .sk-circle5{-webkit-transform:rotate(120deg);transform:rotate(120deg)}.sk-fading-circle .sk-circle6{-webkit-transform:rotate(150deg);transform:rotate(150deg)}.sk-fading-circle .sk-circle7{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.sk-fading-circle .sk-circle8{-webkit-transform:rotate(210deg);transform:rotate(210deg)}.sk-fading-circle .sk-circle9{-webkit-transform:rotate(240deg);transform:rotate(240deg)}.sk-fading-circle .sk-circle10{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.sk-fading-circle .sk-circle11{-webkit-transform:rotate(300deg);transform:rotate(300deg)}.sk-fading-circle .sk-circle12{-webkit-transform:rotate(330deg);transform:rotate(330deg)}.sk-fading-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.sk-fading-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.sk-fading-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}.sk-fading-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.sk-fading-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}.sk-fading-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.sk-fading-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}.sk-fading-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.sk-fading-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}.sk-fading-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.sk-fading-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}@keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}`],
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => AutocompleteComponent),
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
AutocompleteComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbmctYXV0b2NvbXBsZXRlLyIsInNvdXJjZXMiOlsibGliL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUFFLFlBQVksRUFDdkIsVUFBVSxFQUNWLFlBQVksRUFBRSxVQUFVLEVBQ3hCLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUNNLFdBQVcsRUFDMUIsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUt2RSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7OztBQUM1QyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7OztBQUM5QyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7OztBQUM1RSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7OztBQUMxQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUM7OztBQUM3QyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7OztBQUMzQyxNQUFNLEtBQUss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Y2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLCBmb3J3YXJkUmVmLFxuICBJbnB1dCwgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLCBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVib3VuY2VUaW1lLCBmaWx0ZXIsIG1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLyoqXG4gKiBLZXlib2FyZCBldmVudHNcbiAqL1xuY29uc3QgaXNBcnJvd1VwID0ga2V5Q29kZSA9PiBrZXlDb2RlID09PSAzODtcbmNvbnN0IGlzQXJyb3dEb3duID0ga2V5Q29kZSA9PiBrZXlDb2RlID09PSA0MDtcbmNvbnN0IGlzQXJyb3dVcERvd24gPSBrZXlDb2RlID0+IGlzQXJyb3dVcChrZXlDb2RlKSB8fCBpc0Fycm93RG93bihrZXlDb2RlKTtcbmNvbnN0IGlzRW50ZXIgPSBrZXlDb2RlID0+IGtleUNvZGUgPT09IDEzO1xuY29uc3QgaXNCYWNrc3BhY2UgPSBrZXlDb2RlID0+IGtleUNvZGUgPT09IDg7XG5jb25zdCBpc0RlbGV0ZSA9IGtleUNvZGUgPT4ga2V5Q29kZSA9PT0gNDY7XG5jb25zdCBpc0VTQyA9IGtleUNvZGUgPT4ga2V5Q29kZSA9PT0gMjc7XG5jb25zdCBpc1RhYiA9IGtleUNvZGUgPT4ga2V5Q29kZSA9PT0gOTtcblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZy1hdXRvY29tcGxldGUnLFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJhdXRvY29tcGxldGUtY29udGFpbmVyXCJcbiAgICAgW25nQ2xhc3NdPVwieyAnYWN0aXZlJzogaXNPcGVufVwiPlxuICA8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG4gICAgPGlucHV0ICNzZWFyY2hJbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPXt7cGxhY2VIb2xkZXJ9fVxuICAgICAgICAgICBbKG5nTW9kZWwpXT1xdWVyeVxuICAgICAgICAgICAoaW5wdXQpPVwib25DaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgIChmb2N1cyk9aGFuZGxlRm9jdXMoJGV2ZW50KVxuICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICA8ZGl2IGNsYXNzPVwieFwiICpuZ0lmPVwicXVlcnkgJiYgIWlzTG9hZGluZ1wiIChjbGljayk9XCJyZW1vdmUoJGV2ZW50KVwiPlxuICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmNsb3NlPC9pPlxuICAgIDwvZGl2PlxuICAgIDwhLS1Mb2FkaW5nIG1hc2stLT5cbiAgICA8ZGl2IGNsYXNzPVwic2stZmFkaW5nLWNpcmNsZVwiICpuZ0lmPVwiaXNMb2FkaW5nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMSBzay1jaXJjbGVcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUyIHNrLWNpcmNsZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTMgc2stY2lyY2xlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlNCBzay1jaXJjbGVcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU1IHNrLWNpcmNsZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTYgc2stY2lyY2xlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlNyBzay1jaXJjbGVcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU4IHNrLWNpcmNsZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTkgc2stY2lyY2xlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMTAgc2stY2lyY2xlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMTEgc2stY2lyY2xlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMTIgc2stY2lyY2xlXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG4gIDwhLS1GaWx0ZXJlZExpc3QgaXRlbXMtLT5cbiAgPGRpdiBjbGFzcz1cInN1Z2dlc3Rpb25zLWNvbnRhaW5lclwiXG4gICAgICAgW25nQ2xhc3NdPVwieyAnaXMtaGlkZGVuJzogaXNIaXN0b3J5TGlzdFZpc2libGUsICdpcy12aXNpYmxlJzogIWlzSGlzdG9yeUxpc3RWaXNpYmxlfVwiPlxuICAgIDx1bCAjZmlsdGVyZWRMaXN0RWxlbWVudD5cbiAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBmaWx0ZXJlZExpc3Q7IGxldCBpZHggPSBpbmRleFwiIGNsYXNzPVwiaXRlbVwiPlxuICAgICAgICA8IS0tc3RyaW5nIGxvZ2ljLS0+XG4gICAgICAgIDxkaXYgW2NsYXNzLmNvbXBsZXRlLXNlbGVjdGVkXT1cImlkeCA9PT0gc2VsZWN0ZWRJZHhcIiAqbmdJZj0naXNUeXBlKGl0ZW0pJ1xuICAgICAgICAgICAgIChjbGljayk9XCJzZWxlY3QoaXRlbSlcIj5cbiAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgIGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtIHwgaGlnaGxpZ2h0OiB0b0hpZ2hsaWdodCB9XCI+XG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8IS0tb2JqZWN0IGxvZ2ljLS0+XG4gICAgICAgIDxkaXYgW2NsYXNzLmNvbXBsZXRlLXNlbGVjdGVkXT1cImlkeCA9PT0gc2VsZWN0ZWRJZHhcIiAqbmdJZj0nIWlzVHlwZShpdGVtKSdcbiAgICAgICAgICAgICAoY2xpY2spPVwic2VsZWN0KGl0ZW0pXCI+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtIHwgaGlnaGxpZ2h0OiB0b0hpZ2hsaWdodCA6IHNlYXJjaEtleXdvcmQgfVwiPlxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICA8L2Rpdj5cblxuICA8IS0tSGlzdG9yeUxpc3QgaXRlbXMtLT5cbiAgPGRpdiBjbGFzcz1cInN1Z2dlc3Rpb25zLWNvbnRhaW5lclwiXG4gICAgICAgW25nQ2xhc3NdPVwieyAnaXMtaGlkZGVuJzogIWlzSGlzdG9yeUxpc3RWaXNpYmxlLCAnaXMtdmlzaWJsZSc6IGlzSGlzdG9yeUxpc3RWaXNpYmxlfVwiPlxuICAgIDwhLS1IaXN0b3J5TGlzdCBoZWFkaW5nLS0+XG4gICAgPGRpdiBjbGFzcz1cImhpc3RvcnktaGVhZGluZ1wiICpuZ0lmPVwiaGlzdG9yeUxpc3QubGVuZ3RoID4gMCAmJiBoaXN0b3J5SGVhZGluZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cInRleHRcIj57e2hpc3RvcnlIZWFkaW5nfX08L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ4XCIgKGNsaWNrKT1cInJlc2V0SGlzdG9yeUxpc3QoJGV2ZW50KVwiPlxuICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+ZGVsZXRlPC9pPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8dWwgI2hpc3RvcnlMaXN0RWxlbWVudD5cbiAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBoaXN0b3J5TGlzdDsgbGV0IGlkeCA9IGluZGV4XCIgY2xhc3M9XCJpdGVtXCI+XG4gICAgICAgIDwhLS1zdHJpbmcgbG9naWMtLT5cbiAgICAgICAgPGRpdiBbY2xhc3MuY29tcGxldGUtc2VsZWN0ZWRdPVwiaWR4ID09PSBzZWxlY3RlZElkeFwiICpuZ0lmPSdpc1R5cGUoaXRlbSknIChjbGljayk9XCJzZWxlY3QoaXRlbSlcIj5cbiAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgIGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtIH1cIj5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwhLS1vYmplY3QgbG9naWMtLT5cbiAgICAgICAgPGRpdiBbY2xhc3MuY29tcGxldGUtc2VsZWN0ZWRdPVwiaWR4ID09PSBzZWxlY3RlZElkeFwiICpuZ0lmPSchaXNUeXBlKGl0ZW0pJyAoY2xpY2spPVwic2VsZWN0KGl0ZW0pXCI+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtIH1cIj5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ4XCIgKGNsaWNrKT1cInJlbW92ZUhpc3RvcnlJdGVtKGlkeCwgJGV2ZW50KVwiPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5jbG9zZTwvaT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIDwvZGl2PlxuXG4gIDwhLS1Ob3QgZm91bmQtLT5cbiAgPGRpdiBjbGFzcz1cIm5vdC1mb3VuZFwiICpuZ0lmPVwiaXNMb2FkaW5nID8gIWlzTG9hZGluZyAmJiBub3RGb3VuZCA6IG5vdEZvdW5kXCI+XG4gICAgPG5nLWNvbnRhaW5lclxuICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJub3RGb3VuZFRlbXBsYXRlOyAgY29udGV4dDogeyAkaW1wbGljaXQ6IG5vdEZvdW5kVGV4dCAgfVwiPlxuICAgIDwvbmctY29udGFpbmVyPlxuICA8L2Rpdj5cbjwvZGl2PlxuPGRpdiBjbGFzcz1cIm92ZXJsYXlcIiAqbmdJZj1cIm92ZXJsYXlcIiAoY2xpY2spPVwiaGFuZGxlT3ZlcmxheSgpXCI+PC9kaXY+XG5gLFxuICBzdHlsZXM6IFtgQGltcG9ydCB1cmwoaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9pY29uP2ZhbWlseT1NYXRlcmlhbCtJY29ucyk7Lm5nLWF1dG9jb21wbGV0ZXt3aWR0aDo2MDBweH0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lcntib3gtc2hhZG93OjAgMXB4IDNweCAwIHJnYmEoMCwwLDAsLjIpLDAgMXB4IDFweCAwIHJnYmEoMCwwLDAsLjE0KSwwIDJweCAxcHggLTFweCByZ2JhKDAsMCwwLC4xMik7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6dmlzaWJsZTtoZWlnaHQ6NDBweH0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuaW5wdXQtY29udGFpbmVyIGlucHV0e2ZvbnQtc2l6ZToxNHB4O2JveC1zaXppbmc6Ym9yZGVyLWJveDtib3JkZXI6bm9uZTtib3gtc2hhZG93Om5vbmU7b3V0bGluZTowO2JhY2tncm91bmQtY29sb3I6I2ZmZjtjb2xvcjpyZ2JhKDAsMCwwLC44Nyk7d2lkdGg6MTAwJTtwYWRkaW5nOjAgMTVweDtsaW5lLWhlaWdodDo0MHB4O2hlaWdodDo0MHB4fS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5pbnB1dC1jb250YWluZXIgaW5wdXQ6ZGlzYWJsZWR7YmFja2dyb3VuZC1jb2xvcjojZWVlO2NvbG9yOiM2NjZ9LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLmlucHV0LWNvbnRhaW5lciAueHtwb3NpdGlvbjphYnNvbHV0ZTtyaWdodDoxMHB4O21hcmdpbjphdXRvO2N1cnNvcjpwb2ludGVyO3RvcDo1MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuaW5wdXQtY29udGFpbmVyIC54IGl7Y29sb3I6cmdiYSgwLDAsMCwuNTQpO2ZvbnQtc2l6ZToyMnB4O3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuc3VnZ2VzdGlvbnMtY29udGFpbmVye3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEwMCU7YmFja2dyb3VuZDojZmZmO2hlaWdodDphdXRvO2JveC1zaGFkb3c6MCAycHggNXB4IHJnYmEoMCwwLDAsLjI1KTtib3gtc2l6aW5nOmJvcmRlci1ib3h9LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLnN1Z2dlc3Rpb25zLWNvbnRhaW5lciB1bHtwYWRkaW5nOjA7bWFyZ2luOjA7bWF4LWhlaWdodDoyNDBweDtvdmVyZmxvdy15OmF1dG99LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLnN1Z2dlc3Rpb25zLWNvbnRhaW5lciB1bCBsaXtwb3NpdGlvbjpyZWxhdGl2ZTtsaXN0LXN0eWxlOm5vbmU7cGFkZGluZzowO21hcmdpbjowO2N1cnNvcjpwb2ludGVyfS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5zdWdnZXN0aW9ucy1jb250YWluZXIgdWwgbGkgYXtwYWRkaW5nOjE0cHggMTVweDtkaXNwbGF5OmJsb2NrO3RleHQtZGVjb3JhdGlvbjpub25lO2N1cnNvcjpwb2ludGVyO2NvbG9yOnJnYmEoMCwwLDAsLjg3KTtmb250LXNpemU6MTVweH0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuc3VnZ2VzdGlvbnMtY29udGFpbmVyIC5jb21wbGV0ZS1zZWxlY3RlZCwuYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuc3VnZ2VzdGlvbnMtY29udGFpbmVyIHVsIGxpOmhvdmVye2JhY2tncm91bmQtY29sb3I6cmdiYSgxNTgsMTU4LDE1OCwuMTgpfS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5zdWdnZXN0aW9ucy1jb250YWluZXIgLmhpc3RvcnktaGVhZGluZ3twb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nOjEwcHggMTVweDtib3JkZXI6MXB4IHNvbGlkICNmMWYxZjF9LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLnN1Z2dlc3Rpb25zLWNvbnRhaW5lciAuaGlzdG9yeS1oZWFkaW5nIC50ZXh0e2ZvbnQtc2l6ZTouODVlbX0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuc3VnZ2VzdGlvbnMtY29udGFpbmVyIC54e3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjEwcHg7bWFyZ2luOmF1dG87Y3Vyc29yOnBvaW50ZXI7dG9wOjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5zdWdnZXN0aW9ucy1jb250YWluZXIgLnggaXtjb2xvcjpyZ2JhKDAsMCwwLC41NCk7Zm9udC1zaXplOjE4cHg7dmVydGljYWwtYWxpZ246bWlkZGxlfS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5zdWdnZXN0aW9ucy1jb250YWluZXIuaXMtaGlkZGVue3Zpc2liaWxpdHk6aGlkZGVufS5hdXRvY29tcGxldGUtY29udGFpbmVyIC5zdWdnZXN0aW9ucy1jb250YWluZXIuaXMtdmlzaWJsZXt2aXNpYmlsaXR5OnZpc2libGV9LmF1dG9jb21wbGV0ZS1jb250YWluZXIgLm5vdC1mb3VuZHtwYWRkaW5nOjAgLjc1ZW07Ym9yZGVyOjFweCBzb2xpZCAjZjFmMWYxO2JhY2tncm91bmQ6I2ZmZn0uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAubm90LWZvdW5kIGRpdntwYWRkaW5nOi40ZW0gMDtmb250LXNpemU6Ljk1ZW07bGluZS1oZWlnaHQ6MS40O2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHJnYmEoMjMwLDIzMCwyMzAsLjcpfS5hdXRvY29tcGxldGUtY29udGFpbmVyLmFjdGl2ZXt6LWluZGV4Ojk5OX0uaGlnaGxpZ2h0e2ZvbnQtd2VpZ2h0OjcwMH0ub3ZlcmxheXtwb3NpdGlvbjphYnNvbHV0ZTtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50O3RvcDowO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO3otaW5kZXg6NTB9aW5wdXRbdHlwZT10ZXh0XTo6LW1zLWNsZWFye2Rpc3BsYXk6bm9uZX0uc2stZmFkaW5nLWNpcmNsZXt3aWR0aDoyMHB4O2hlaWdodDoyMHB4O3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjEwcHg7dG9wOjA7Ym90dG9tOjA7bWFyZ2luOmF1dG99LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MH0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOmJlZm9yZXtjb250ZW50OicnO2Rpc3BsYXk6YmxvY2s7bWFyZ2luOjAgYXV0bzt3aWR0aDoxNSU7aGVpZ2h0OjE1JTtiYWNrZ3JvdW5kLWNvbG9yOiMzMzM7Ym9yZGVyLXJhZGl1czoxMDAlOy13ZWJraXQtYW5pbWF0aW9uOjEuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYm90aCBzay1jaXJjbGVGYWRlRGVsYXk7YW5pbWF0aW9uOjEuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYm90aCBzay1jaXJjbGVGYWRlRGVsYXl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTJ7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDMwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlM3std2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNjBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoNjBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU0ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg5MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSg5MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDEyMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgxMjBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU2ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgxNTBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMTUwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlN3std2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDE4MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTh7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDIxMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgyMTBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU5ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgyNDBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMjQwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTB7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDI3MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgyNzBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMwMGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTEyey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgzMzBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMzMwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LTEuMXM7YW5pbWF0aW9uLWRlbGF5Oi0xLjFzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUzOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotMXM7YW5pbWF0aW9uLWRlbGF5Oi0xc30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNDpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS45czthbmltYXRpb24tZGVsYXk6LS45c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS44czthbmltYXRpb24tZGVsYXk6LS44c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS43czthbmltYXRpb24tZGVsYXk6LS43c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNzpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS42czthbmltYXRpb24tZGVsYXk6LS42c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlODpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS41czthbmltYXRpb24tZGVsYXk6LS41c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS40czthbmltYXRpb24tZGVsYXk6LS40c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTA6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uM3M7YW5pbWF0aW9uLWRlbGF5Oi0uM3N9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTExOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotLjJzO2FuaW1hdGlvbi1kZWxheTotLjJzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS4xczthbmltYXRpb24tZGVsYXk6LS4xc31ALXdlYmtpdC1rZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5ezAlLDEwMCUsMzkle29wYWNpdHk6MH00MCV7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHNrLWNpcmNsZUZhZGVEZWxheXswJSwxMDAlLDM5JXtvcGFjaXR5OjB9NDAle29wYWNpdHk6MX19YF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQXV0b2NvbXBsZXRlQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJyhkb2N1bWVudDpjbGljayknOiAnaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gICAgJ2NsYXNzJzogJ25nLWF1dG9jb21wbGV0ZSdcbiAgfSxcbn0pXG5cbmV4cG9ydCBjbGFzcyBBdXRvY29tcGxldGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBAVmlld0NoaWxkKCdzZWFyY2hJbnB1dCcpIHNlYXJjaElucHV0OiBFbGVtZW50UmVmOyAvLyBpbnB1dCBlbGVtZW50XG4gIEBWaWV3Q2hpbGQoJ2ZpbHRlcmVkTGlzdEVsZW1lbnQnKSBmaWx0ZXJlZExpc3RFbGVtZW50OiBFbGVtZW50UmVmOyAvLyBlbGVtZW50IG9mIGl0ZW1zXG4gIEBWaWV3Q2hpbGQoJ2hpc3RvcnlMaXN0RWxlbWVudCcpIGhpc3RvcnlMaXN0RWxlbWVudDogRWxlbWVudFJlZjsgLy8gZWxlbWVudCBvZiBoaXN0b3J5IGl0ZW1zXG5cbiAgaW5wdXRLZXlVcCQ6IE9ic2VydmFibGU8YW55PjsgLy8gaW5wdXQgZXZlbnRzXG4gIGlucHV0S2V5RG93biQ6IE9ic2VydmFibGU8YW55PjsgLy8gaW5wdXQgZXZlbnRzXG5cbiAgcHVibGljIHF1ZXJ5ID0gJyc7IC8vIHNlYXJjaCBxdWVyeVxuICBwdWJsaWMgZmlsdGVyZWRMaXN0ID0gW107IC8vIGxpc3Qgb2YgaXRlbXNcbiAgcHVibGljIGhpc3RvcnlMaXN0ID0gW107IC8vIGxpc3Qgb2YgaGlzdG9yeSBpdGVtc1xuICBwdWJsaWMgaXNIaXN0b3J5TGlzdFZpc2libGUgPSB0cnVlO1xuICBwdWJsaWMgZWxlbWVudFJlZjtcbiAgcHVibGljIHNlbGVjdGVkSWR4ID0gLTE7XG4gIHB1YmxpYyB0b0hpZ2hsaWdodDogc3RyaW5nID0gJyc7XG4gIHB1YmxpYyBub3RGb3VuZCA9IGZhbHNlO1xuICBwdWJsaWMgaXNGb2N1c2VkID0gZmFsc2U7XG4gIHB1YmxpYyBpc09wZW4gPSBmYWxzZTtcbiAgcHVibGljIGlzU2Nyb2xsVG9FbmQgPSBmYWxzZTtcbiAgcHVibGljIG92ZXJsYXkgPSBmYWxzZTtcbiAgcHJpdmF0ZSBtYW51YWxPcGVuID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIG1hbnVhbENsb3NlID0gdW5kZWZpbmVkO1xuXG5cbiAgLy8gaW5wdXRzXG4gIC8qKlxuICAgKiBEYXRhIG9mIGl0ZW1zIGxpc3QuXG4gICAqIEl0IGNhbiBiZSBhcnJheSBvZiBzdHJpbmdzIG9yIGFycmF5IG9mIG9iamVjdHMuXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgZGF0YSA9IFtdO1xuICBASW5wdXQoKSBwdWJsaWMgc2VhcmNoS2V5d29yZDogc3RyaW5nOyAvLyBrZXl3b3JkIHRvIGZpbHRlciB0aGUgbGlzdFxuICBASW5wdXQoKSBwdWJsaWMgcGxhY2VIb2xkZXIgPSAnJzsgLy8gaW5wdXQgcGxhY2Vob2xkZXJcbiAgQElucHV0KCkgcHVibGljIGluaXRpYWxWYWx1ZTogYW55OyAvLyBzZXQgaW5pdGlhbCB2YWx1ZVxuICAvKipcbiAgICogSGlzdG9yeSBpZGVudGlmaWVyIG9mIGhpc3RvcnkgbGlzdFxuICAgKiBXaGVuIHZhbGlkIGhpc3RvcnkgaWRlbnRpZmllciBpcyBnaXZlbiwgdGhlbiBjb21wb25lbnQgc3RvcmVzIHNlbGVjdGVkIGl0ZW0gdG8gbG9jYWwgc3RvcmFnZSBvZiB1c2VyJ3MgYnJvd3Nlci5cbiAgICogSWYgaXQgaXMgbnVsbCB0aGVuIGhpc3RvcnkgaXMgaGlkZGVuLlxuICAgKiBIaXN0b3J5IGxpc3QgaXMgdmlzaWJsZSBpZiBhdCBsZWFzdCBvbmUgaGlzdG9yeSBpdGVtIGlzIHN0b3JlZC5cbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBoaXN0b3J5SWRlbnRpZmllcjogc3RyaW5nO1xuICAvKipcbiAgICogSGVhZGluZyB0ZXh0IG9mIGhpc3RvcnkgbGlzdC5cbiAgICogSWYgaXQgaXMgbnVsbCB0aGVuIGhpc3RvcnkgaGVhZGluZyBpcyBoaWRkZW4uXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgaGlzdG9yeUhlYWRpbmcgPSAnUmVjZW50bHkgc2VsZWN0ZWQnO1xuICBASW5wdXQoKSBwdWJsaWMgaGlzdG9yeUxpc3RNYXhOdW1iZXIgPSAxNTsgLy8gbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgaW4gdGhlIGhpc3RvcnkgbGlzdC5cbiAgQElucHV0KCkgcHVibGljIG5vdEZvdW5kVGV4dCA9ICdOb3QgZm91bmQnOyAvLyBzZXQgY3VzdG9tIHRleHQgd2hlbiBmaWx0ZXIgcmV0dXJucyBlbXB0eSByZXN1bHRcbiAgQElucHV0KCkgcHVibGljIGlzTG9hZGluZzogYm9vbGVhbjsgLy8gbG9hZGluZyBtYXNrXG4gIEBJbnB1dCgpIHB1YmxpYyBkZWJvdW5jZVRpbWU6IDQwMDsgLy8gZGVsYXkgdGltZSB3aGlsZSB0eXBpbmdcbiAgQElucHV0KCkgcHVibGljIGRpc2FibGVkOiBib29sZWFuOyAvLyBpbnB1dCBkaXNhYmxlL2VuYWJsZVxuICAvKipcbiAgICogVGhlIG1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhlIHVzZXIgbXVzdCB0eXBlIGJlZm9yZSBhIHNlYXJjaCBpcyBwZXJmb3JtZWQuXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgbWluUXVlcnlMZW5ndGggPSAxO1xuXG5cbiAgLy8gb3V0cHV0IGV2ZW50c1xuICAvKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW5ldmVyIGFuIGl0ZW0gZnJvbSB0aGUgbGlzdCBpcyBzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuZXZlciBhbiBpbnB1dCBpcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgaW5wdXRDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuZXZlciBhbiBpbnB1dCBpcyBmb2N1c2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaW5wdXRGb2N1c2VkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuZXZlciBhbiBpbnB1dCBpcyBjbGVhcmVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaW5wdXRDbGVhcmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2VkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHNjcm9sbGVkIHRvIHRoZSBlbmQgb2YgaXRlbXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzY3JvbGxlZFRvRW5kOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblxuICAvLyBjdXN0b20gdGVtcGxhdGVzXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpXG4gIEBJbnB1dCgpIGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQElucHV0KCkgbm90Rm91bmRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogUHJvcGFnYXRlcyBuZXcgdmFsdWUgd2hlbiBtb2RlbCBjaGFuZ2VzXG4gICAqL1xuICBwcm9wYWdhdGVDaGFuZ2U6IGFueSA9ICgpID0+IHtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBXcml0ZXMgYSBuZXcgdmFsdWUgZnJvbSB0aGUgZm9ybSBtb2RlbCBpbnRvIHRoZSB2aWV3LFxuICAgKiBVcGRhdGVzIG1vZGVsXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnF1ZXJ5ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgaGFuZGxlciB0aGF0IGlzIGNhbGxlZCB3aGVuIHNvbWV0aGluZyBpbiB0aGUgdmlldyBoYXMgY2hhbmdlZFxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgaGFuZGxlciBzcGVjaWZpY2FsbHkgZm9yIHdoZW4gYSBjb250cm9sIHJlY2VpdmVzIGEgdG91Y2ggZXZlbnRcbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgdmFsdWUgb2YgYW4gaW5wdXQgZWxlbWVudCBpcyBjaGFuZ2VkXG4gICAqL1xuICBvbkNoYW5nZShldmVudCkge1xuICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbGVtZW50UmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgc3RhdHVzIGNoYW5nZXMgdG8gb3IgZnJvbSBESVNBQkxFRFxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmhhbmRsZVNjcm9sbCgpO1xuICAgIHRoaXMuaW5pdEV2ZW50U3RyZWFtKCk7XG4gICAgdGhpcy5zZXRJbml0aWFsVmFsdWUodGhpcy5pbml0aWFsVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBpbml0aWFsIHZhbHVlXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHNldEluaXRpYWxWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbFZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBzZWFyY2ggcmVzdWx0c1xuICAgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZXMgJiZcbiAgICAgIGNoYW5nZXMuZGF0YSAmJlxuICAgICAgQXJyYXkuaXNBcnJheShjaGFuZ2VzLmRhdGEuY3VycmVudFZhbHVlKVxuICAgICkge1xuICAgICAgdGhpcy5oYW5kbGVJdGVtc0NoYW5nZSgpO1xuICAgICAgaWYgKCFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UgJiYgdGhpcy5pc0ZvY3VzZWQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVPcGVuKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEl0ZW1zIGNoYW5nZVxuICAgKi9cbiAgcHVibGljIGhhbmRsZUl0ZW1zQ2hhbmdlKCkge1xuICAgIHRoaXMuaXNTY3JvbGxUb0VuZCA9IGZhbHNlO1xuICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IHRoaXMuZGF0YTtcbiAgICB0aGlzLm5vdEZvdW5kID0gIXRoaXMuZmlsdGVyZWRMaXN0IHx8IHRoaXMuZmlsdGVyZWRMaXN0Lmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWx0ZXIgZGF0YVxuICAgKi9cbiAgcHVibGljIGZpbHRlckxpc3QoKSB7XG4gICAgdGhpcy5zZWxlY3RlZElkeCA9IC0xO1xuICAgIHRoaXMuaW5pdFNlYXJjaEhpc3RvcnkoKTtcbiAgICBpZiAodGhpcy5xdWVyeSAhPSBudWxsICYmIHRoaXMuZGF0YSkge1xuICAgICAgdGhpcy50b0hpZ2hsaWdodCA9IHRoaXMucXVlcnk7XG4gICAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IHRoaXMuZGF0YS5maWx0ZXIoKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gc3RyaW5nIGxvZ2ljLCBjaGVjayBlcXVhbGl0eSBvZiBzdHJpbmdzXG4gICAgICAgICAgcmV0dXJuIGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSkgPiAtMTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgLy8gb2JqZWN0IGxvZ2ljLCBjaGVjayBwcm9wZXJ0eSBlcXVhbGl0eVxuICAgICAgICAgIHJldHVybiBpdGVtW3RoaXMuc2VhcmNoS2V5d29yZF0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSkgPiAtMTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm90Rm91bmQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDaGVjayB0eXBlIG9mIGl0ZW0gaW4gdGhlIGxpc3QuXG4gICAqIEBwYXJhbSBpdGVtXG4gICAqL1xuICBpc1R5cGUoaXRlbSkge1xuICAgIHJldHVybiB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZyc7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0IGl0ZW0gaW4gdGhlIGxpc3QuXG4gICAqIEBwYXJhbSBpdGVtXG4gICAqL1xuICBwdWJsaWMgc2VsZWN0KGl0ZW0pIHtcbiAgICB0aGlzLnF1ZXJ5ID0gIXRoaXMuaXNUeXBlKGl0ZW0pID8gaXRlbVt0aGlzLnNlYXJjaEtleXdvcmRdIDogaXRlbTtcbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgdGhpcy5vdmVybGF5ID0gZmFsc2U7XG4gICAgdGhpcy5zZWxlY3RlZC5lbWl0KGl0ZW0pO1xuICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlKGl0ZW0pO1xuXG4gICAgaWYgKHRoaXMuaW5pdGlhbFZhbHVlKSB7XG4gICAgICAvLyBjaGVjayBpZiBoaXN0b3J5IGFscmVhZHkgZXhpc3RzIGluIGxvY2FsU3RvcmFnZSBhbmQgdGhlbiB1cGRhdGVcbiAgICAgIGNvbnN0IGhpc3RvcnkgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5oaXN0b3J5SWRlbnRpZmllcn1gKTtcbiAgICAgIGlmIChoaXN0b3J5KSB7XG4gICAgICAgIGxldCBleGlzdGluZ0hpc3RvcnkgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtgJHt0aGlzLmhpc3RvcnlJZGVudGlmaWVyfWBdKTtcbiAgICAgICAgaWYgKCEoZXhpc3RpbmdIaXN0b3J5IGluc3RhbmNlb2YgQXJyYXkpKSBleGlzdGluZ0hpc3RvcnkgPSBbXTtcblxuICAgICAgICAvLyBjaGVjayBpZiBzZWxlY3RlZCBpdGVtIGV4aXN0cyBpbiBleGlzdGluZ0hpc3RvcnlcbiAgICAgICAgaWYgKCFleGlzdGluZ0hpc3Rvcnkuc29tZSgoZXhpc3RpbmdJdGVtKSA9PiAhdGhpcy5pc1R5cGUoZXhpc3RpbmdJdGVtKVxuICAgICAgICAgID8gZXhpc3RpbmdJdGVtW3RoaXMuc2VhcmNoS2V5d29yZF0gPT0gaXRlbVt0aGlzLnNlYXJjaEtleXdvcmRdIDogZXhpc3RpbmdJdGVtID09IGl0ZW0pKSB7XG4gICAgICAgICAgZXhpc3RpbmdIaXN0b3J5LnVuc2hpZnQoaXRlbSk7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dGhpcy5oaXN0b3J5SWRlbnRpZmllcn1gLCBKU09OLnN0cmluZ2lmeShleGlzdGluZ0hpc3RvcnkpKTtcblxuICAgICAgICAgIC8vIGNoZWNrIGlmIGl0ZW1zIGRvbid0IGV4Y2VlZCBtYXggYWxsb3dlZCBudW1iZXJcbiAgICAgICAgICBpZiAoZXhpc3RpbmdIaXN0b3J5Lmxlbmd0aCA+PSB0aGlzLmhpc3RvcnlMaXN0TWF4TnVtYmVyKSB7XG4gICAgICAgICAgICBleGlzdGluZ0hpc3Rvcnkuc3BsaWNlKGV4aXN0aW5nSGlzdG9yeS5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3RoaXMuaGlzdG9yeUlkZW50aWZpZXJ9YCwgSlNPTi5zdHJpbmdpZnkoZXhpc3RpbmdIaXN0b3J5KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmIHNlbGVjdGVkIGl0ZW0gZXhpc3RzIGluIGV4aXN0aW5nSGlzdG9yeSBzd2FwIHRvIHRvcCBpbiBhcnJheVxuICAgICAgICAgIGlmICghdGhpcy5pc1R5cGUoaXRlbSkpIHtcbiAgICAgICAgICAgIC8vIG9iamVjdCBsb2dpY1xuICAgICAgICAgICAgY29uc3QgY29waWVkRXhpc3RpbmdIaXN0b3J5ID0gZXhpc3RpbmdIaXN0b3J5LnNsaWNlKCk7IC8vIGNvcHkgb3JpZ2luYWwgZXhpc3RpbmdIaXN0b3J5IGFycmF5XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gY29waWVkRXhpc3RpbmdIaXN0b3J5Lm1hcCgoZWwpID0+IGVsW3RoaXMuc2VhcmNoS2V5d29yZF0pLmluZGV4T2YoaXRlbVt0aGlzLnNlYXJjaEtleXdvcmRdKTtcbiAgICAgICAgICAgIGNvcGllZEV4aXN0aW5nSGlzdG9yeS5zcGxpY2Uoc2VsZWN0ZWRJbmRleCwgMSk7XG4gICAgICAgICAgICBjb3BpZWRFeGlzdGluZ0hpc3Rvcnkuc3BsaWNlKDAsIDAsIGl0ZW0pO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dGhpcy5oaXN0b3J5SWRlbnRpZmllcn1gLCBKU09OLnN0cmluZ2lmeShjb3BpZWRFeGlzdGluZ0hpc3RvcnkpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gc3RyaW5nIGxvZ2ljXG4gICAgICAgICAgICBjb25zdCBjb3BpZWRFeGlzdGluZ0hpc3RvcnkgPSBleGlzdGluZ0hpc3Rvcnkuc2xpY2UoKTsgLy8gY29weSBvcmlnaW5hbCBleGlzdGluZ0hpc3RvcnkgYXJyYXlcbiAgICAgICAgICAgIGNvcGllZEV4aXN0aW5nSGlzdG9yeS5zcGxpY2UoY29waWVkRXhpc3RpbmdIaXN0b3J5LmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgY29waWVkRXhpc3RpbmdIaXN0b3J5LnNwbGljZSgwLCAwLCBpdGVtKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3RoaXMuaGlzdG9yeUlkZW50aWZpZXJ9YCwgSlNPTi5zdHJpbmdpZnkoY29waWVkRXhpc3RpbmdIaXN0b3J5KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNhdmVIaXN0b3J5KGl0ZW0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNhdmVIaXN0b3J5KGl0ZW0pO1xuICAgIH1cbiAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogRG9jdW1lbnQgY2xpY2tcbiAgICogQHBhcmFtIGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBoYW5kbGVDbGljayhlKSB7XG4gICAgbGV0IGNsaWNrZWRDb21wb25lbnQgPSBlLnRhcmdldDtcbiAgICBsZXQgaW5zaWRlID0gZmFsc2U7XG4gICAgZG8ge1xuICAgICAgaWYgKGNsaWNrZWRDb21wb25lbnQgPT09IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgIGluc2lkZSA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmVkTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZU9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2xpY2tlZENvbXBvbmVudCA9IGNsaWNrZWRDb21wb25lbnQucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlIChjbGlja2VkQ29tcG9uZW50KTtcbiAgICBpZiAoIWluc2lkZSkge1xuICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgYm9keSBvdmVybGF5XG4gICAqL1xuICBoYW5kbGVPdmVybGF5KCkge1xuICAgIHRoaXMub3ZlcmxheSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjcm9sbCBpdGVtc1xuICAgKi9cbiAgcHVibGljIGhhbmRsZVNjcm9sbCgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmZpbHRlcmVkTGlzdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9FbmQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgcGFuZWwgc3RhdGVcbiAgICovXG4gIHNldFBhbmVsU3RhdGUoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICAvLyBJZiBjb250cm9scyBhcmUgdW50b3VjaGVkXG4gICAgaWYgKHR5cGVvZiB0aGlzLm1hbnVhbE9wZW4gPT09ICd1bmRlZmluZWQnXG4gICAgICAmJiB0eXBlb2YgdGhpcy5tYW51YWxDbG9zZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgICB0aGlzLmhhbmRsZU9wZW4oKTtcbiAgICB9XG5cbiAgICAvLyBJZiBvbmUgb2YgdGhlIGNvbnRyb2xzIGlzIHVudG91Y2hlZCBhbmQgb3RoZXIgaXMgZGVhY3RpdmF0ZWRcbiAgICBpZiAodHlwZW9mIHRoaXMubWFudWFsT3BlbiA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICYmIHRoaXMubWFudWFsQ2xvc2UgPT09IGZhbHNlXG4gICAgICB8fCB0eXBlb2YgdGhpcy5tYW51YWxDbG9zZSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICYmIHRoaXMubWFudWFsT3BlbiA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgICB0aGlzLmhhbmRsZU9wZW4oKTtcbiAgICB9XG5cbiAgICAvLyBpZiBjb250cm9scyBhcmUgdG91Y2hlZCBidXQgYm90aCBhcmUgZGVhY3RpdmF0ZWRcbiAgICBpZiAodGhpcy5tYW51YWxPcGVuID09PSBmYWxzZSAmJiB0aGlzLm1hbnVhbENsb3NlID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuaGFuZGxlT3BlbigpO1xuICAgIH1cblxuICAgIC8vIGlmIG9wZW4gY29udHJvbCBpcyB0b3VjaGVkIGFuZCBhY3RpdmF0ZWRcbiAgICBpZiAodGhpcy5tYW51YWxPcGVuKSB7XG4gICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5oYW5kbGVPcGVuKCk7XG4gICAgICB0aGlzLm1hbnVhbE9wZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBpZiBjbG9zZSBjb250cm9sIGlzIHRvdWNoZWQgYW5kIGFjdGl2YXRlZFxuICAgIGlmICh0aGlzLm1hbnVhbENsb3NlKSB7XG4gICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgICB0aGlzLm1hbnVhbENsb3NlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hbnVhbCBjb250cm9sc1xuICAgKi9cbiAgb3BlbigpIHtcbiAgICB0aGlzLm1hbnVhbE9wZW4gPSB0cnVlO1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5oYW5kbGVPcGVuKCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLm1hbnVhbENsb3NlID0gdHJ1ZTtcbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5oYW5kbGVGb2N1cyhldmVudCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnJlbW92ZShldmVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHNlYXJjaCBxdWVyeVxuICAgKi9cbiAgcHVibGljIHJlbW92ZShlKSB7XG4gICAgaWYgKGUgJiYgZS5zdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICAgIHRoaXMucXVlcnkgPSAnJztcbiAgICB0aGlzLmlucHV0Q2xlYXJlZC5lbWl0KCk7XG4gICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UodGhpcy5xdWVyeSk7XG4gICAgdGhpcy5zZXRQYW5lbFN0YXRlKGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgaGlzdG9yeUxpc3Qgc2VhcmNoXG4gICAqL1xuICBpbml0U2VhcmNoSGlzdG9yeSgpIHtcbiAgICB0aGlzLmlzSGlzdG9yeUxpc3RWaXNpYmxlID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuaGlzdG9yeUlkZW50aWZpZXIgJiYgIXRoaXMucXVlcnkpIHtcbiAgICAgIGNvbnN0IGhpc3RvcnkgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5oaXN0b3J5SWRlbnRpZmllcn1gKTtcbiAgICAgIGlmIChoaXN0b3J5KSB7XG4gICAgICAgIHRoaXMuaXNIaXN0b3J5TGlzdFZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IFtdO1xuICAgICAgICB0aGlzLmhpc3RvcnlMaXN0ID0gaGlzdG9yeSA/IEpTT04ucGFyc2UoaGlzdG9yeSkgOiBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaXNIaXN0b3J5TGlzdFZpc2libGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pc0hpc3RvcnlMaXN0VmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU9wZW4oKSB7XG4gICAgaWYgKHRoaXMuaXNPcGVuIHx8IHRoaXMuaXNPcGVuICYmICF0aGlzLmlzTG9hZGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBJZiBkYXRhIGV4aXN0c1xuICAgIGlmICh0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgICAgdGhpcy5vdmVybGF5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlsdGVyTGlzdCgpO1xuICAgICAgdGhpcy5vcGVuZWQuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNsb3NlKCkge1xuICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5vdmVybGF5ID0gZmFsc2U7XG4gICAgdGhpcy5maWx0ZXJlZExpc3QgPSBbXTtcbiAgICB0aGlzLnNlbGVjdGVkSWR4ID0gLTE7XG4gICAgdGhpcy5ub3RGb3VuZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNIaXN0b3J5TGlzdFZpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMuY2xvc2VkLmVtaXQoKTtcbiAgfVxuXG4gIGhhbmRsZUZvY3VzKGUpIHtcbiAgICAvL3RoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIGlmICh0aGlzLmlzRm9jdXNlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmlucHV0Rm9jdXNlZC5lbWl0KGUpO1xuICAgIC8vIGlmIGRhdGEgZXhpc3RzIHRoZW4gb3BlblxuICAgIGlmICh0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRQYW5lbFN0YXRlKGV2ZW50KTtcbiAgICB9XG4gICAgdGhpcy5pc0ZvY3VzZWQgPSB0cnVlO1xuICB9XG5cbiAgc2Nyb2xsVG9FbmQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNTY3JvbGxUb0VuZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHRoaXMuZmlsdGVyZWRMaXN0RWxlbWVudC5uYXRpdmVFbGVtZW50XG4gICAgICAuc2Nyb2xsVG9wO1xuICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IHRoaXMuZmlsdGVyZWRMaXN0RWxlbWVudC5uYXRpdmVFbGVtZW50XG4gICAgICAuc2Nyb2xsSGVpZ2h0O1xuICAgIGNvbnN0IGVsZW1lbnRIZWlnaHQgPSB0aGlzLmZpbHRlcmVkTGlzdEVsZW1lbnQubmF0aXZlRWxlbWVudFxuICAgICAgLmNsaWVudEhlaWdodDtcbiAgICBjb25zdCBhdEJvdHRvbSA9IHNjcm9sbEhlaWdodCA9PT0gc2Nyb2xsVG9wICsgZWxlbWVudEhlaWdodDtcbiAgICBpZiAoYXRCb3R0b20pIHtcbiAgICAgIHRoaXMuc2Nyb2xsZWRUb0VuZC5lbWl0KCk7XG4gICAgICB0aGlzLmlzU2Nyb2xsVG9FbmQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGtleWJvYXJkIGV2ZW50c1xuICAgKi9cbiAgaW5pdEV2ZW50U3RyZWFtKCkge1xuICAgIHRoaXMuaW5wdXRLZXlVcCQgPSBmcm9tRXZlbnQoXG4gICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQsICdrZXl1cCdcbiAgICApLnBpcGUobWFwKFxuICAgICAgKGU6IGFueSkgPT4gZVxuICAgICkpO1xuXG4gICAgdGhpcy5pbnB1dEtleURvd24kID0gZnJvbUV2ZW50KFxuICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2tleWRvd24nXG4gICAgKS5waXBlKG1hcChcbiAgICAgIChlOiBhbnkpID0+IGVcbiAgICApKTtcblxuICAgIHRoaXMubGlzdGVuRXZlbnRTdHJlYW0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4ga2V5Ym9hcmQgZXZlbnRzXG4gICAqL1xuICBsaXN0ZW5FdmVudFN0cmVhbSgpIHtcbiAgICAvLyBrZXkgdXAgZXZlbnRcbiAgICB0aGlzLmlucHV0S2V5VXAkXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGUgPT5cbiAgICAgICAgICAhaXNBcnJvd1VwRG93bihlLmtleUNvZGUpICYmXG4gICAgICAgICAgIWlzRW50ZXIoZS5rZXlDb2RlKSAmJlxuICAgICAgICAgICFpc0VTQyhlLmtleUNvZGUpICYmXG4gICAgICAgICAgIWlzVGFiKGUua2V5Q29kZSkpLFxuICAgICAgICBkZWJvdW5jZVRpbWUodGhpcy5kZWJvdW5jZVRpbWUpXG4gICAgICApLnN1YnNjcmliZShlID0+IHtcbiAgICAgIHRoaXMub25LZXlVcChlKTtcbiAgICB9KTtcblxuICAgIC8vIGN1cnNvciB1cCAmIGRvd25cbiAgICB0aGlzLmlucHV0S2V5RG93biQucGlwZShmaWx0ZXIoXG4gICAgICBlID0+IGlzQXJyb3dVcERvd24oZS5rZXlDb2RlKVxuICAgICkpLnN1YnNjcmliZShlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMub25Gb2N1c0l0ZW0oZSk7XG4gICAgfSk7XG5cbiAgICAvLyBlbnRlciBrZXl1cFxuICAgIHRoaXMuaW5wdXRLZXlVcCQucGlwZShmaWx0ZXIoZSA9PiBpc0VudGVyKGUua2V5Q29kZSkpKS5zdWJzY3JpYmUoZSA9PiB7XG4gICAgICAvL3RoaXMub25IYW5kbGVFbnRlcigpO1xuICAgIH0pO1xuXG4gICAgLy8gZW50ZXIga2V5ZG93blxuICAgIHRoaXMuaW5wdXRLZXlEb3duJC5waXBlKGZpbHRlcihlID0+IGlzRW50ZXIoZS5rZXlDb2RlKSkpLnN1YnNjcmliZShlID0+IHtcbiAgICAgIHRoaXMub25IYW5kbGVFbnRlcigpO1xuICAgIH0pO1xuXG4gICAgLy8gRVNDXG4gICAgdGhpcy5pbnB1dEtleVVwJC5waXBlKFxuICAgICAgZmlsdGVyKGUgPT4gaXNFU0MoZS5rZXlDb2RlKSxcbiAgICAgICAgZGVib3VuY2VUaW1lKDEwMCkpXG4gICAgKS5zdWJzY3JpYmUoZSA9PiB7XG4gICAgICB0aGlzLm9uRXNjKCk7XG4gICAgfSk7XG5cbiAgICAvLyBkZWxldGVcbiAgICB0aGlzLmlucHV0S2V5RG93biQucGlwZShcbiAgICAgIGZpbHRlcihlID0+IGlzQmFja3NwYWNlKGUua2V5Q29kZSkgfHwgaXNEZWxldGUoZS5rZXlDb2RlKSlcbiAgICApLnN1YnNjcmliZShlID0+IHtcbiAgICAgIHRoaXMub25EZWxldGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBvbiBrZXl1cCA9PSB3aGVuIGlucHV0IGNoYW5nZWRcbiAgICogQHBhcmFtIGUgZXZlbnRcbiAgICovXG4gIG9uS2V5VXAoZSkge1xuICAgIHRoaXMubm90Rm91bmQgPSBmYWxzZTsgLy8gc2VhcmNoIHJlc3VsdHMgYXJlIHVua25vd24gd2hpbGUgdHlwaW5nXG4gICAgLy8gaWYgaW5wdXQgaXMgZW1wdHlcbiAgICBpZiAoIXRoaXMucXVlcnkpIHtcbiAgICAgIHRoaXMubm90Rm91bmQgPSBmYWxzZTtcbiAgICAgIHRoaXMuaW5wdXRDaGFuZ2VkLmVtaXQoZS50YXJnZXQudmFsdWUpO1xuICAgICAgdGhpcy5pbnB1dENsZWFyZWQuZW1pdCgpO1xuICAgICAgLy90aGlzLmZpbHRlckxpc3QoKTtcbiAgICAgIHRoaXMuc2V0UGFuZWxTdGF0ZShlKTtcbiAgICB9XG4gICAgLy8gaWYgcXVlcnkgPj0gdG8gbWluUXVlcnlMZW5ndGhcbiAgICBpZiAodGhpcy5xdWVyeS5sZW5ndGggPj0gdGhpcy5taW5RdWVyeUxlbmd0aCkge1xuICAgICAgdGhpcy5pbnB1dENoYW5nZWQuZW1pdChlLnRhcmdldC52YWx1ZSk7XG4gICAgICB0aGlzLmZpbHRlckxpc3QoKTtcblxuICAgICAgLy8gSWYgbm8gcmVzdWx0cyBmb3VuZFxuICAgICAgaWYgKCF0aGlzLmZpbHRlcmVkTGlzdC5sZW5ndGggJiYgIXRoaXMuaXNMb2FkaW5nKSB7XG4gICAgICAgIHRoaXMubm90Rm91bmRUZXh0ID8gdGhpcy5ub3RGb3VuZCA9IHRydWUgOiB0aGlzLm5vdEZvdW5kID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogS2V5Ym9hcmQgYXJyb3cgdG9wIGFuZCBhcnJvdyBib3R0b21cbiAgICogQHBhcmFtIGUgZXZlbnRcbiAgICovXG4gIG9uRm9jdXNJdGVtKGUpIHtcbiAgICAvLyBtb3ZlIGFycm93IHVwIGFuZCBkb3duIG9uIGZpbHRlcmVkTGlzdCBvciBoaXN0b3J5TGlzdFxuICAgIGlmICghdGhpcy5oaXN0b3J5TGlzdC5sZW5ndGggfHwgIXRoaXMuaXNIaXN0b3J5TGlzdFZpc2libGUpIHtcbiAgICAgIC8vIGZpbHRlcmVkTGlzdFxuICAgICAgY29uc3QgdG90YWxOdW1JdGVtID0gdGhpcy5maWx0ZXJlZExpc3QubGVuZ3RoO1xuICAgICAgaWYgKGUua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgICBsZXQgc3VtID0gdGhpcy5zZWxlY3RlZElkeDtcbiAgICAgICAgc3VtID0gKHRoaXMuc2VsZWN0ZWRJZHggPT09IG51bGwpID8gMCA6IHN1bSArIDE7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJZHggPSAodG90YWxOdW1JdGVtICsgc3VtKSAlIHRvdGFsTnVtSXRlbTtcbiAgICAgICAgdGhpcy5zY3JvbGxUb0ZvY3VzZWRJdGVtKHRoaXMuc2VsZWN0ZWRJZHgpO1xuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0Fycm93VXAnKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSWR4ID09IC0xKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZElkeCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RlZElkeCA9ICh0b3RhbE51bUl0ZW0gKyB0aGlzLnNlbGVjdGVkSWR4IC0gMSkgJSB0b3RhbE51bUl0ZW07XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Gb2N1c2VkSXRlbSh0aGlzLnNlbGVjdGVkSWR4KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaGlzdG9yeUxpc3RcbiAgICAgIGNvbnN0IHRvdGFsTnVtSXRlbSA9IHRoaXMuaGlzdG9yeUxpc3QubGVuZ3RoO1xuICAgICAgaWYgKGUua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgICBsZXQgc3VtID0gdGhpcy5zZWxlY3RlZElkeDtcbiAgICAgICAgc3VtID0gKHRoaXMuc2VsZWN0ZWRJZHggPT09IG51bGwpID8gMCA6IHN1bSArIDE7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJZHggPSAodG90YWxOdW1JdGVtICsgc3VtKSAlIHRvdGFsTnVtSXRlbTtcbiAgICAgICAgdGhpcy5zY3JvbGxUb0ZvY3VzZWRJdGVtKHRoaXMuc2VsZWN0ZWRJZHgpO1xuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0Fycm93VXAnKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSWR4ID09IC0xKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZElkeCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RlZElkeCA9ICh0b3RhbE51bUl0ZW0gKyB0aGlzLnNlbGVjdGVkSWR4IC0gMSkgJSB0b3RhbE51bUl0ZW07XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Gb2N1c2VkSXRlbSh0aGlzLnNlbGVjdGVkSWR4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2Nyb2xsIHRvIGZvY3VzZWQgaXRlbVxuICAgKiAqIEBwYXJhbSBpbmRleFxuICAgKi9cbiAgc2Nyb2xsVG9Gb2N1c2VkSXRlbShpbmRleCkge1xuICAgIGxldCBsaXN0RWxlbWVudCA9IG51bGw7XG4gICAgLy8gRGVmaW5lIGxpc3QgZWxlbWVudFxuICAgIGlmICghdGhpcy5oaXN0b3J5TGlzdC5sZW5ndGggfHwgIXRoaXMuaXNIaXN0b3J5TGlzdFZpc2libGUpIHtcbiAgICAgIC8vIGZpbHRlcmVkTGlzdCBlbGVtZW50XG4gICAgICBsaXN0RWxlbWVudCA9IHRoaXMuZmlsdGVyZWRMaXN0RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBoaXN0b3J5TGlzdCBlbGVtZW50XG4gICAgICBsaXN0RWxlbWVudCA9IHRoaXMuaGlzdG9yeUxpc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChsaXN0RWxlbWVudC5jaGlsZE5vZGVzKS5maWx0ZXIoKG5vZGU6IGFueSkgPT4ge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgLy8gaWYgbm9kZSBpcyBlbGVtZW50XG4gICAgICAgIHJldHVybiBub2RlLmNsYXNzTmFtZS5pbmNsdWRlcygnaXRlbScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0SGVpZ2h0ID0gbGlzdEVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSBpdGVtc1tpbmRleF0ub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHZpc2libGVUb3AgPSBsaXN0RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgY29uc3QgdmlzaWJsZUJvdHRvbSA9IGxpc3RFbGVtZW50LnNjcm9sbFRvcCArIGxpc3RIZWlnaHQgLSBpdGVtSGVpZ2h0O1xuICAgIGNvbnN0IHRhcmdldFBvc2l0aW9uID0gaXRlbXNbaW5kZXhdLm9mZnNldFRvcDtcblxuICAgIGlmICh0YXJnZXRQb3NpdGlvbiA8IHZpc2libGVUb3ApIHtcbiAgICAgIGxpc3RFbGVtZW50LnNjcm9sbFRvcCA9IHRhcmdldFBvc2l0aW9uO1xuICAgIH1cblxuICAgIGlmICh0YXJnZXRQb3NpdGlvbiA+IHZpc2libGVCb3R0b20pIHtcbiAgICAgIGxpc3RFbGVtZW50LnNjcm9sbFRvcCA9IHRhcmdldFBvc2l0aW9uIC0gbGlzdEhlaWdodCArIGl0ZW1IZWlnaHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdCBpdGVtIG9uIGVudGVyIGNsaWNrXG4gICAqL1xuICBvbkhhbmRsZUVudGVyKCkge1xuICAgIC8vIGNsaWNrIGVudGVyIHRvIGNob29zZSBpdGVtIGZyb20gZmlsdGVyZWRMaXN0IG9yIGhpc3RvcnlMaXN0XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRJZHggPiAtMSkge1xuICAgICAgaWYgKCF0aGlzLmhpc3RvcnlMaXN0Lmxlbmd0aCB8fCAhdGhpcy5pc0hpc3RvcnlMaXN0VmlzaWJsZSkge1xuICAgICAgICAvLyBmaWx0ZXJlZExpc3RcbiAgICAgICAgdGhpcy5xdWVyeSA9ICF0aGlzLmlzVHlwZSh0aGlzLmZpbHRlcmVkTGlzdFt0aGlzLnNlbGVjdGVkSWR4XSlcbiAgICAgICAgICA/IHRoaXMuZmlsdGVyZWRMaXN0W3RoaXMuc2VsZWN0ZWRJZHhdW3RoaXMuc2VhcmNoS2V5d29yZF1cbiAgICAgICAgICA6IHRoaXMuZmlsdGVyZWRMaXN0W3RoaXMuc2VsZWN0ZWRJZHhdO1xuXG4gICAgICAgIHRoaXMuc2F2ZUhpc3RvcnkodGhpcy5maWx0ZXJlZExpc3RbdGhpcy5zZWxlY3RlZElkeF0pO1xuICAgICAgICB0aGlzLnNlbGVjdCh0aGlzLmZpbHRlcmVkTGlzdFt0aGlzLnNlbGVjdGVkSWR4XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBoaXN0b3J5TGlzdFxuICAgICAgICB0aGlzLnF1ZXJ5ID0gIXRoaXMuaXNUeXBlKHRoaXMuaGlzdG9yeUxpc3RbdGhpcy5zZWxlY3RlZElkeF0pXG4gICAgICAgICAgPyB0aGlzLmhpc3RvcnlMaXN0W3RoaXMuc2VsZWN0ZWRJZHhdW3RoaXMuc2VhcmNoS2V5d29yZF1cbiAgICAgICAgICA6IHRoaXMuaGlzdG9yeUxpc3RbdGhpcy5zZWxlY3RlZElkeF07XG4gICAgICAgIHRoaXMuc2F2ZUhpc3RvcnkodGhpcy5oaXN0b3J5TGlzdFt0aGlzLnNlbGVjdGVkSWR4XSk7XG4gICAgICAgIHRoaXMuc2VsZWN0KHRoaXMuaGlzdG9yeUxpc3RbdGhpcy5zZWxlY3RlZElkeF0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmlzSGlzdG9yeUxpc3RWaXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVzYyBjbGlja1xuICAgKi9cbiAgb25Fc2MoKSB7XG4gICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGNsaWNrXG4gICAqL1xuICBvbkRlbGV0ZSgpIHtcbiAgICAvLyBwYW5lbCBpcyBvcGVuIG9uIGRlbGV0ZVxuICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNlbGVjdCBpdGVtIHRvIHNhdmUgaW4gbG9jYWxTdG9yYWdlXG4gICAqIEBwYXJhbSBzZWxlY3RlZFxuICAgKi9cbiAgc2F2ZUhpc3Rvcnkoc2VsZWN0ZWQpIHtcbiAgICBpZiAodGhpcy5oaXN0b3J5SWRlbnRpZmllcikge1xuICAgICAgLy8gY2hlY2sgaWYgc2VsZWN0ZWQgaXRlbSBleGlzdHMgaW4gaGlzdG9yeUxpc3RcbiAgICAgIGlmICghdGhpcy5oaXN0b3J5TGlzdC5zb21lKChpdGVtKSA9PiAhdGhpcy5pc1R5cGUoaXRlbSlcbiAgICAgICAgPyBpdGVtW3RoaXMuc2VhcmNoS2V5d29yZF0gPT0gc2VsZWN0ZWRbdGhpcy5zZWFyY2hLZXl3b3JkXSA6IGl0ZW0gPT0gc2VsZWN0ZWQpKSB7XG4gICAgICAgIHRoaXMuc2F2ZUhpc3RvcnlUb0xvY2FsU3RvcmFnZShbc2VsZWN0ZWQsIC4uLnRoaXMuaGlzdG9yeUxpc3RdKTtcblxuICAgICAgICAvLyBjaGVjayBpZiBpdGVtcyBkb24ndCBleGNlZWQgbWF4IGFsbG93ZWQgbnVtYmVyXG4gICAgICAgIGlmICh0aGlzLmhpc3RvcnlMaXN0Lmxlbmd0aCA+PSB0aGlzLmhpc3RvcnlMaXN0TWF4TnVtYmVyKSB7XG4gICAgICAgICAgdGhpcy5oaXN0b3J5TGlzdC5zcGxpY2UodGhpcy5oaXN0b3J5TGlzdC5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgICB0aGlzLnNhdmVIaXN0b3J5VG9Mb2NhbFN0b3JhZ2UoW3NlbGVjdGVkLCAuLi50aGlzLmhpc3RvcnlMaXN0XSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHNlbGVjdGVkIGl0ZW0gZXhpc3RzIGluIGhpc3RvcnlMaXN0IHN3YXAgdG8gdG9wIGluIGFycmF5XG4gICAgICAgIGlmICghdGhpcy5pc1R5cGUoc2VsZWN0ZWQpKSB7XG4gICAgICAgICAgLy8gb2JqZWN0IGxvZ2ljXG4gICAgICAgICAgY29uc3QgY29waWVkSGlzdG9yeUxpc3QgPSB0aGlzLmhpc3RvcnlMaXN0LnNsaWNlKCk7IC8vIGNvcHkgb3JpZ2luYWwgaGlzdG9yeUxpc3QgYXJyYXlcbiAgICAgICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gY29waWVkSGlzdG9yeUxpc3QubWFwKChpdGVtKSA9PiBpdGVtW3RoaXMuc2VhcmNoS2V5d29yZF0pLmluZGV4T2Yoc2VsZWN0ZWRbdGhpcy5zZWFyY2hLZXl3b3JkXSk7XG4gICAgICAgICAgY29waWVkSGlzdG9yeUxpc3Quc3BsaWNlKHNlbGVjdGVkSW5kZXgsIDEpO1xuICAgICAgICAgIGNvcGllZEhpc3RvcnlMaXN0LnNwbGljZSgwLCAwLCBzZWxlY3RlZCk7XG4gICAgICAgICAgdGhpcy5zYXZlSGlzdG9yeVRvTG9jYWxTdG9yYWdlKFsuLi5jb3BpZWRIaXN0b3J5TGlzdF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHN0cmluZyBsb2dpY1xuICAgICAgICAgIGNvbnN0IGNvcGllZEhpc3RvcnlMaXN0ID0gdGhpcy5oaXN0b3J5TGlzdC5zbGljZSgpOyAvLyBjb3B5IG9yaWdpbmFsIGhpc3RvcnlMaXN0IGFycmF5XG4gICAgICAgICAgY29waWVkSGlzdG9yeUxpc3Quc3BsaWNlKHRoaXMuaGlzdG9yeUxpc3QuaW5kZXhPZihzZWxlY3RlZCksIDEpO1xuICAgICAgICAgIGNvcGllZEhpc3RvcnlMaXN0LnNwbGljZSgwLCAwLCBzZWxlY3RlZCk7XG4gICAgICAgICAgdGhpcy5zYXZlSGlzdG9yeVRvTG9jYWxTdG9yYWdlKFsuLi5jb3BpZWRIaXN0b3J5TGlzdF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgaXRlbSBpbiBsb2NhbFN0b3JhZ2VcbiAgICogQHBhcmFtIHNlbGVjdGVkXG4gICAqL1xuICBzYXZlSGlzdG9yeVRvTG9jYWxTdG9yYWdlKHNlbGVjdGVkKSB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgYCR7dGhpcy5oaXN0b3J5SWRlbnRpZmllcn1gLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWQpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgaXRlbSBmcm9tIGxvY2FsU3RvcmFnZVxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICogQHBhcmFtIGUgZXZlbnRcbiAgICovXG4gIHJlbW92ZUhpc3RvcnlJdGVtKGluZGV4LCBlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLmhpc3RvcnlMaXN0ID0gdGhpcy5oaXN0b3J5TGlzdC5maWx0ZXIoKHYsIGkpID0+IGkgIT09IGluZGV4KTtcbiAgICB0aGlzLnNhdmVIaXN0b3J5VG9Mb2NhbFN0b3JhZ2UodGhpcy5oaXN0b3J5TGlzdCk7XG4gICAgaWYgKHRoaXMuaGlzdG9yeUxpc3QubGVuZ3RoID09IDApIHtcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShgJHt0aGlzLmhpc3RvcnlJZGVudGlmaWVyfWApO1xuICAgICAgdGhpcy5maWx0ZXJMaXN0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGxvY2FsU3RvcmFnZVxuICAgKiBAcGFyYW0gZSBldmVudFxuICAgKi9cbiAgcmVzZXRIaXN0b3J5TGlzdChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLmhpc3RvcnlMaXN0ID0gW107XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGAke3RoaXMuaGlzdG9yeUlkZW50aWZpZXJ9YCk7XG4gICAgdGhpcy5maWx0ZXJMaXN0KCk7XG4gIH1cbn1cbiJdfQ==