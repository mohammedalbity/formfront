<template>
  <div class="component-properties-editor p-3 sm:p-4">
    <!-- Basic Properties -->
    <div v-if="!isEditingSingleTab" class="property-section mb-4 sm:mb-6">
      <h4
        class="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide"
      >
        {{ $t('formBuilder.properties.basic') }}
      </h4>

      <!-- Label -->
      <div class="property-field mb-3 sm:mb-4">
        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.label') }}
        </label>
        <input
          v-model="localComponent.label"
          type="text"
          class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Key -->
      <div class="property-field mb-3 sm:mb-4">
        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.key') }}
        </label>
        <input
          v-model="localComponent.key"
          type="text"
          class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="emitUpdate"
        />
        <p class="text-xs text-gray-500 mt-1">
          {{ $t('formBuilder.properties.keyHelp') }}
        </p>
      </div>

      <!-- Tree Node Properties (for tree node editing) -->
      <div v-if="localComponent.type === 'treenode'" class="space-y-4">
        <!-- Node Label -->
        <div class="property-field mb-3 sm:mb-4">
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.nodeLabel') || 'Node Label' }}
          </label>
          <input
            v-model="localComponent.nodeData.label"
            type="text"
            class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="emitTreeNodeUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ $t('formBuilder.nodeLabelHelp') || 'The display name for this tree node' }}
          </p>
        </div>

        <!-- Node Value -->
        <div class="property-field mb-3 sm:mb-4">
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.nodeValue') || 'Node Value' }}
          </label>
          <input
            v-model="localComponent.nodeData.value"
            type="text"
            class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="emitTreeNodeUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ $t('formBuilder.nodeValueHelp') || 'The internal value for this tree node' }}
          </p>
        </div>

        <!-- Node Expanded State -->
        <div class="property-field mb-3 sm:mb-4">
          <label class="flex items-center space-x-2">
            <input
              v-model="localComponent.nodeData.expanded"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              @change="emitTreeNodeUpdate"
            />
            <span class="text-xs sm:text-sm font-medium text-gray-700">
              {{ $t('formBuilder.nodeExpanded') || 'Expanded by default' }}
            </span>
          </label>
          <p class="text-xs text-gray-500 mt-1 ml-6">
            {{
              $t('formBuilder.nodeExpandedHelp') ||
              'Whether this node should be expanded by default'
            }}
          </p>
        </div>
      </div>

      <!-- Placeholder (for input components) -->
      <div v-if="hasPlaceholder" class="property-field mb-3 sm:mb-4">
        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.placeholder') }}
        </label>
        <input
          v-model="localComponent.placeholder"
          type="text"
          class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Default Value (for hidden fields and input components) -->
      <div v-if="hasDefaultValue" class="property-field mb-3 sm:mb-4">
        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.defaultValue') }}
        </label>
        <input
          v-model="localComponent.defaultValue"
          type="text"
          :placeholder="$t('formBuilder.properties.defaultValuePlaceholder')"
          class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="emitUpdate"
        />
        <p class="text-xs text-gray-500 mt-1">
          {{ $t('formBuilder.properties.defaultValueHelp') }}
        </p>
      </div>

      <!-- Description -->
      <div class="property-field mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.description') }}
        </label>
        <textarea
          v-model="localComponent.description"
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Required -->
      <div v-if="hasValidation" class="property-field mb-4">
        <label class="flex items-center">
          <input
            v-model="isRequired"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            @change="updateRequired"
          />
          <span class="ml-2 text-sm font-medium text-gray-700">
            {{ $t('formBuilder.properties.required') }}
          </span>
        </label>
      </div>
    </div>

    <!-- Tab Properties (single tab editing mode) -->
    <div
      v-if="
        isEditingSingleTab &&
        localComponent.type === 'tabs' &&
        tabEditIndex !== null &&
        Array.isArray(localComponent.components)
      "
      class="property-section mb-6"
    >
      <h4 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        {{ $t('formBuilder.tab') }}
      </h4>

      <!-- Current Tab Label -->
      <div class="property-field mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.tabName') || 'Tab name' }}
        </label>
        <input
          v-model="localComponent.components[tabEditIndex as number].label"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Current Tab Key -->
      <div class="property-field">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.key') }}
        </label>
        <input
          v-model="localComponent.components[tabEditIndex as number].key"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>
    </div>

    <!-- Component-specific Properties -->
    <div
      v-if="!isEditingSingleTab && componentSpecificProperties.length > 0"
      class="property-section mb-6"
    >
      <h4 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        {{ $t('formBuilder.properties.specific') }}
      </h4>

      <!-- Text Area Rows -->
      <div v-if="localComponent.type === 'textarea'" class="property-field mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.rows') }}
        </label>
        <input
          v-model.number="localComponent.rows"
          type="number"
          min="1"
          max="20"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Select/Radio Options -->
      <div v-if="hasOptions" class="property-field mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('formBuilder.properties.options') }}
        </label>
        <div class="space-y-2">
          <div v-for="(option, index) in options" :key="index" class="flex items-center gap-2">
            <input
              v-model="option.label"
              type="text"
              :placeholder="$t('formBuilder.properties.optionLabel')"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="updateOptions"
            />
            <input
              v-model="option.value"
              type="text"
              :placeholder="$t('formBuilder.properties.optionValue')"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="updateOptions"
            />
            <button
              @click="removeOption(index)"
              class="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          <button
            @click="addOption"
            class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + {{ $t('formBuilder.properties.addOption') }}
          </button>
        </div>
      </div>

      <!-- HTML Element Properties -->
      <div v-if="localComponent.type === 'htmlelement'" class="space-y-4">
        <!-- HTML Tag -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.htmlTag') }}
          </label>
          <CustomSelect
            v-model="localComponent.tag"
            :options="htmlTagOptions"
            @change="emitUpdate"
            containerClass="w-full"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ $t('formBuilder.properties.htmlTagHelp') }}
          </p>
        </div>

        <!-- HTML Content -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.htmlContent') }}
          </label>
          <textarea
            v-model="localComponent.content"
            rows="4"
            :placeholder="$t('formBuilder.properties.htmlContentPlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            @input="emitUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ $t('formBuilder.properties.htmlContentHelp') }}
          </p>
        </div>

        <!-- CSS Classes -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.cssClasses') }}
          </label>
          <input
            v-model="localComponent.className"
            type="text"
            :placeholder="$t('formBuilder.properties.cssClassesPlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="emitUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ $t('formBuilder.properties.cssClassesHelp') }}
          </p>
        </div>

        <!-- HTML Attributes -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('formBuilder.properties.htmlAttributes') }}
          </label>
          <div class="space-y-2">
            <div
              v-for="(attr, index) in htmlAttributes"
              :key="index"
              class="flex items-center gap-2"
            >
              <input
                v-model="attr.name"
                type="text"
                :placeholder="$t('formBuilder.properties.attributeName')"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                @input="updateHtmlAttributes"
              />
              <input
                v-model="attr.value"
                type="text"
                :placeholder="$t('formBuilder.properties.attributeValue')"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                @input="updateHtmlAttributes"
              />
              <button
                @click="removeHtmlAttribute(index)"
                class="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
            <button
              @click="addHtmlAttribute"
              class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm"
            >
              + {{ $t('formBuilder.properties.addAttribute') }}
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ $t('formBuilder.properties.htmlAttributesHelp') }}
          </p>
        </div>
      </div>

      <!-- Static Content Properties -->
      <div v-if="localComponent.type === 'content'" class="space-y-4">
        <!-- Content Type -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.contentType') }}
          </label>
          <CustomSelect
            v-model="localComponent.wysiwyg"
            :options="contentTypeOptions"
            @change="emitUpdate"
            containerClass="w-full"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ $t('formBuilder.properties.contentTypeHelp') }}
          </p>
        </div>

        <!-- HTML Content -->
        <div v-if="!localComponent.wysiwyg" class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.htmlContent') }}
          </label>
          <textarea
            v-model="localComponent.html"
            rows="6"
            :placeholder="$t('formBuilder.properties.htmlContentPlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            @input="emitUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ $t('formBuilder.properties.htmlContentHelp') }}
          </p>
        </div>

        <!-- Plain Text Content -->
        <div v-if="localComponent.wysiwyg" class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.textContent') }}
          </label>
          <textarea
            v-model="localComponent.content"
            rows="6"
            :placeholder="$t('formBuilder.properties.textContentPlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="emitUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ $t('formBuilder.properties.textContentHelp') }}
          </p>
        </div>
      </div>

      <!-- Button Properties -->
      <div v-if="localComponent.type === 'button'" class="space-y-4">
        <!-- Button Action -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.action') }}
          </label>
          <CustomSelect
            v-model="localComponent.action"
            :options="buttonActionOptions"
            @change="emitUpdate"
            containerClass="w-full"
          />
        </div>

        <!-- Button Theme -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.theme') }}
          </label>
          <CustomSelect
            v-model="localComponent.theme"
            :options="buttonThemeOptions"
            @change="emitUpdate"
            containerClass="w-full"
          />
        </div>
      </div>

      <!-- Signature Properties -->
      <div v-if="localComponent.type === 'signature'" class="space-y-4">
        <!-- Signature Width -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('signature.width') }}
          </label>
          <input
            v-model.number="localComponent.width"
            type="number"
            min="200"
            max="800"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="emitUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">Width of the signature pad in pixels (200-800)</p>
        </div>

        <!-- Signature Height -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('signature.height') }}
          </label>
          <input
            v-model.number="localComponent.height"
            type="number"
            min="100"
            max="400"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="emitUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">Height of the signature pad in pixels (100-400)</p>
        </div>

        <!-- Stroke Color -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('signature.strokeColor') }}
          </label>
          <input
            v-model="localComponent.strokeColor"
            type="color"
            class="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="emitUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">Color of the signature stroke</p>
        </div>

        <!-- Stroke Width -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('signature.strokeWidth') }}
          </label>
          <input
            v-model.number="localComponent.strokeWidth"
            type="number"
            min="1"
            max="10"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="emitUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">Width of the signature stroke in pixels (1-10)</p>
        </div>

        <!-- Background Color -->
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('signature.backgroundColor') }}
          </label>
          <input
            v-model="localComponent.backgroundColor"
            type="color"
            class="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="emitUpdate"
          />
          <p class="text-xs text-gray-500 mt-1">Background color of the signature pad</p>
        </div>
      </div>
    </div>

    <!-- Validation Properties -->
    <div v-if="hasValidation" class="property-section mb-6">
      <h4 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        {{ $t('formBuilder.properties.validation') }}
      </h4>

      <!-- Min/Max Length -->
      <div v-if="hasLengthValidation" class="grid grid-cols-2 gap-4 mb-4">
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.minLength') }}
          </label>
          <input
            v-model.number="validation.minLength"
            type="number"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="updateValidation"
          />
        </div>
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.maxLength') }}
          </label>
          <input
            v-model.number="validation.maxLength"
            type="number"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="updateValidation"
          />
        </div>
      </div>

      <!-- Min/Max Value -->
      <div v-if="hasValueValidation" class="grid grid-cols-2 gap-4 mb-4">
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.min') }}
          </label>
          <input
            v-model.number="validation.min"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="updateValidation"
          />
        </div>
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.max') }}
          </label>
          <input
            v-model.number="validation.max"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="updateValidation"
          />
        </div>
      </div>

      <!-- Pattern -->
      <div v-if="hasPatternValidation" class="property-field mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.pattern') }}
        </label>
        <input
          v-model="validation.pattern"
          type="text"
          :placeholder="$t('formBuilder.properties.patternPlaceholder')"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="updateValidation"
        />
        <p class="text-xs text-gray-500 mt-1">
          {{ $t('formBuilder.properties.patternHelp') }}
        </p>
      </div>

      <!-- Custom Validation -->
      <div class="property-field mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.customValidation') }}
        </label>
        <textarea
          v-model="validation.custom"
          rows="3"
          :placeholder="$t('formBuilder.properties.customValidationPlaceholder')"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          @input="updateValidation"
        />
        <p class="text-xs text-gray-500 mt-1">
          {{ $t('formBuilder.properties.customValidationHelp') }}
        </p>
      </div>
    </div>

    <!-- Conditional Logic -->
    <div class="property-section mb-6">
      <h4 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        {{ $t('formBuilder.properties.conditional') }}
      </h4>

      <!-- Enable Conditional -->
      <div class="property-field mb-4">
        <label class="flex items-center">
          <input
            v-model="hasConditional"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            @change="toggleConditional"
          />
          <span class="ml-2 text-sm font-medium text-gray-700">
            {{ $t('formBuilder.properties.enableConditional') }}
          </span>
        </label>
      </div>

      <!-- Conditional Settings -->
      <div v-if="hasConditional" class="space-y-4">
        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.conditionalField') }}
          </label>
          <input
            v-model="conditional.when"
            type="text"
            :placeholder="$t('formBuilder.properties.conditionalFieldPlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="updateConditional"
          />
        </div>

        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.conditionalOperator') }}
          </label>
          <CustomSelect
            v-model="conditional.operator"
            :options="conditionalOperatorOptions"
            @change="updateConditional"
            containerClass="w-full"
          />
        </div>

        <div class="property-field">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('formBuilder.properties.conditionalValue') }}
          </label>
          <input
            v-model="conditional.value"
            type="text"
            :placeholder="$t('formBuilder.properties.conditionalValuePlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="updateConditional"
          />
        </div>
      </div>
    </div>

    <!-- Advanced Properties -->
    <div class="property-section">
      <h4 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        {{ $t('formBuilder.properties.advanced') }}
      </h4>

      <!-- Disabled -->
      <div class="property-field mb-4">
        <label class="flex items-center">
          <input
            v-model="localComponent.disabled"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            @change="emitUpdate"
          />
          <span class="ml-2 text-sm font-medium text-gray-700">
            {{ $t('formBuilder.properties.disabled') }}
          </span>
        </label>
      </div>

      <!-- Hidden -->
      <div class="property-field mb-4">
        <label class="flex items-center">
          <input
            v-model="localComponent.hidden"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            @change="emitUpdate"
          />
          <span class="ml-2 text-sm font-medium text-gray-700">
            {{ $t('formBuilder.properties.hidden') }}
          </span>
        </label>
      </div>

      <!-- CSS Class -->
      <div class="property-field mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('formBuilder.properties.cssClass') }}
        </label>
        <input
          v-model="localComponent.customClass"
          type="text"
          :placeholder="$t('formBuilder.properties.cssClassPlaceholder')"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomSelect from './CustomSelect.vue'

// Types
interface FormComponent {
  type: string
  key: string
  label: string
  input?: boolean
  placeholder?: string
  required?: boolean
  validate?: any
  conditional?: any
  disabled?: boolean
  hidden?: boolean
  customClass?: string
  description?: string
  rows?: number
  data?: any
  values?: any[]
  action?: string
  theme?: string
  [key: string]: any
}

interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  custom?: string
}

interface ConditionalLogic {
  show?: boolean
  when?: string
  operator?: string
  value?: any
}

// Props & Emits
interface Props {
  component: FormComponent
  tabEditIndex?: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [component: FormComponent]
  'tree-node-update': [data: { nodeId: any; nodeData: any; treeIndex: any; componentPath: any }]
}>()

// When editing a specific tab of a Tabs component, hide general properties and show only per-tab fields
const isEditingSingleTab = computed<boolean>(
  () => props.component.type === 'tabs' && props.tabEditIndex !== null,
)

// Composables
const { t } = useI18n()

// Reactive data
const localComponent = ref<FormComponent>({ ...props.component })
const validation = ref<ValidationRules>({})
const conditional = ref<ConditionalLogic>({})
const options = ref<Array<{ label: string; value: string }>>([])
const htmlAttributes = ref<Array<{ name: string; value: string }>>([])
const hasConditional = ref(false)

// Computed
const hasPlaceholder = computed(() => {
  return ['textfield', 'textarea', 'number', 'email', 'password'].includes(
    localComponent.value.type,
  )
})

const hasValidation = computed(() => {
  // Components that can have validation (including required)
  const validatableComponents = [
    'textfield',
    'textarea',
    'number',
    'email',
    'password',
    'select',
    'radio',
    'checkbox',
    'file',
    'signature',
    'survey',
    'tree',
    'resource',
    'tagpad',
    'datagrid',
    'editgrid',
  ]
  return (
    validatableComponents.includes(localComponent.value.type) ||
    (localComponent.value.input && localComponent.value.type !== 'button')
  )
})

const hasLengthValidation = computed(() => {
  return ['textfield', 'textarea', 'email', 'password'].includes(localComponent.value.type)
})

const hasValueValidation = computed(() => {
  return localComponent.value.type === 'number'
})

const hasPatternValidation = computed(() => {
  return ['textfield', 'email', 'password'].includes(localComponent.value.type)
})

const hasOptions = computed(() => {
  return ['select', 'radio'].includes(localComponent.value.type)
})

const hasDefaultValue = computed(() => {
  return [
    'hidden',
    'textfield',
    'textarea',
    'number',
    'email',
    'password',
    'select',
    'radio',
    'checkbox',
  ].includes(localComponent.value.type)
})

const isRequired = computed({
  get: () => validation.value.required || false,
  set: (value: boolean) => {
    validation.value.required = value
    updateValidation()
  },
})

const componentSpecificProperties = computed(() => {
  const props = []

  if (localComponent.value.type === 'textarea') {
    props.push('rows')
  }

  if (hasOptions.value) {
    props.push('options')
  }

  if (localComponent.value.type === 'button') {
    props.push('action', 'theme')
  }

  if (localComponent.value.type === 'htmlelement') {
    props.push('tag', 'content', 'className', 'attributes')
  }

  if (localComponent.value.type === 'content') {
    props.push('contentType', 'html', 'content')
  }

  return props
})

// Select options for different components
const htmlTagOptions = computed(() => [
  { value: 'div', label: 'div' },
  { value: 'p', label: 'p' },
  { value: 'h1', label: 'h1' },
  { value: 'h2', label: 'h2' },
  { value: 'h3', label: 'h3' },
  { value: 'h4', label: 'h4' },
  { value: 'h5', label: 'h5' },
  { value: 'h6', label: 'h6' },
  { value: 'span', label: 'span' },
  { value: 'a', label: 'a' },
  { value: 'img', label: 'img' },
  { value: 'strong', label: 'strong' },
  { value: 'em', label: 'em' },
  { value: 'ul', label: 'ul' },
  { value: 'ol', label: 'ol' },
  { value: 'li', label: 'li' },
  { value: 'blockquote', label: 'blockquote' },
  { value: 'code', label: 'code' },
  { value: 'pre', label: 'pre' },
])

const contentTypeOptions = computed(() => [
  { value: 'false', label: t('formBuilder.properties.contentTypes.html') },
  { value: 'true', label: t('formBuilder.properties.contentTypes.wysiwyg') },
])

const buttonActionOptions = computed(() => [
  { value: 'submit', label: t('formBuilder.properties.actions.submit') },
  { value: 'reset', label: t('formBuilder.properties.actions.reset') },
  { value: 'custom', label: t('formBuilder.properties.actions.custom') },
])

const buttonThemeOptions = computed(() => [
  { value: 'primary', label: t('formBuilder.properties.themes.primary') },
  { value: 'secondary', label: t('formBuilder.properties.themes.secondary') },
  { value: 'success', label: t('formBuilder.properties.themes.success') },
  { value: 'danger', label: t('formBuilder.properties.themes.danger') },
  { value: 'warning', label: t('formBuilder.properties.themes.warning') },
  { value: 'info', label: t('formBuilder.properties.themes.info') },
])

const conditionalOperatorOptions = computed(() => [
  { value: 'eq', label: t('formBuilder.properties.operators.equals') },
  { value: 'ne', label: t('formBuilder.properties.operators.notEquals') },
  { value: 'gt', label: t('formBuilder.properties.operators.greaterThan') },
  { value: 'lt', label: t('formBuilder.properties.operators.lessThan') },
  { value: 'contains', label: t('formBuilder.properties.operators.contains') },
])

// Methods
const emitUpdate = () => {
  emit('update', { ...localComponent.value })
}

const emitTreeNodeUpdate = () => {
  console.log('🌳 Tree node update:', localComponent.value.nodeData)
  // Emit tree node specific update
  emit('tree-node-update', {
    nodeId: localComponent.value.nodeData?.id,
    nodeData: { ...localComponent.value.nodeData },
    treeIndex: localComponent.value.treeIndex,
    componentPath: localComponent.value.componentPath,
  })
}

const updateRequired = () => {
  if (!localComponent.value.validate) {
    localComponent.value.validate = {}
  }
  localComponent.value.validate.required = isRequired.value
  emitUpdate()
}

const updateValidation = () => {
  if (!localComponent.value.validate) {
    localComponent.value.validate = {}
  }

  Object.assign(localComponent.value.validate, validation.value)
  emitUpdate()
}

const updateConditional = () => {
  if (hasConditional.value) {
    localComponent.value.conditional = {
      show: true,
      when: conditional.value.when,
      [conditional.value.operator || 'eq']: conditional.value.value,
    }
  } else {
    delete localComponent.value.conditional
  }
  emitUpdate()
}

const toggleConditional = () => {
  if (hasConditional.value) {
    conditional.value = {
      when: '',
      operator: 'eq',
      value: '',
    }
  } else {
    delete localComponent.value.conditional
  }
  updateConditional()
}

const updateOptions = () => {
  if (localComponent.value.type === 'select') {
    if (!localComponent.value.data) {
      localComponent.value.data = {}
    }
    localComponent.value.data.values = options.value.filter((opt) => opt.label || opt.value)
  } else if (localComponent.value.type === 'radio') {
    localComponent.value.values = options.value.filter((opt) => opt.label || opt.value)
  }
  emitUpdate()
}

const addOption = () => {
  options.value.push({ label: '', value: '' })
}

const removeOption = (index: number) => {
  options.value.splice(index, 1)
  updateOptions()
}

// HTML Attributes methods
const updateHtmlAttributes = () => {
  if (!localComponent.value.attrs) {
    localComponent.value.attrs = []
  }
  localComponent.value.attrs = htmlAttributes.value.filter((attr) => attr.name || attr.value)
  emitUpdate()
}

const addHtmlAttribute = () => {
  htmlAttributes.value.push({ name: '', value: '' })
}

const removeHtmlAttribute = (index: number) => {
  htmlAttributes.value.splice(index, 1)
  updateHtmlAttributes()
}

// Initialize component data
const initializeComponent = () => {
  // Initialize validation
  if (localComponent.value.validate) {
    validation.value = { ...localComponent.value.validate }
  }

  // Initialize conditional
  if (localComponent.value.conditional) {
    hasConditional.value = true
    conditional.value = {
      when: localComponent.value.conditional.when,
      operator:
        Object.keys(localComponent.value.conditional).find(
          (key) => !['show', 'when'].includes(key),
        ) || 'eq',
      value:
        localComponent.value.conditional[
          Object.keys(localComponent.value.conditional).find(
            (key) => !['show', 'when'].includes(key),
          ) || 'eq'
        ],
    }
  }

  // Initialize options
  if (hasOptions.value) {
    if (localComponent.value.type === 'select' && localComponent.value.data?.values) {
      options.value = [...localComponent.value.data.values]
    } else if (localComponent.value.type === 'radio' && localComponent.value.values) {
      options.value = [...localComponent.value.values]
    } else {
      options.value = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ]
      updateOptions()
    }
  }

  // Initialize HTML attributes
  if (localComponent.value.type === 'htmlelement') {
    if (localComponent.value.attrs && Array.isArray(localComponent.value.attrs)) {
      htmlAttributes.value = [...localComponent.value.attrs]
    } else {
      htmlAttributes.value = []
    }
  }
}

// Watchers
watch(
  () => props.component,
  (newComponent) => {
    localComponent.value = { ...newComponent }
    initializeComponent()
  },
  { deep: true },
)

// Lifecycle
onMounted(() => {
  initializeComponent()
})
</script>

<style scoped>
.property-section {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
}

.property-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.property-field input:focus,
.property-field select:focus,
.property-field textarea:focus {
  outline: none;
}
</style>
