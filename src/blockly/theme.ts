import * as Blockly from 'blockly';

export const ScratchTheme = Blockly.Theme.defineTheme('scratch', {
    name: 'scratch',
    base: Blockly.Themes.Classic,
    blockStyles: {
        motion_blocks: {
            colourPrimary: '#4C97FF',
            colourSecondary: '#3373CC',
            colourTertiary: '#2E5EB0',
        },
        looks_blocks: {
            colourPrimary: '#9966FF',
            colourSecondary: '#774DCB',
            colourTertiary: '#5E3BA6',
        },
        sound_blocks: {
            colourPrimary: '#CF63CF',
            colourSecondary: '#BD42BD',
            colourTertiary: '#A63DA6',
        },
        event_blocks: {
            colourPrimary: '#FFBF00',
            colourSecondary: '#E6AC00',
            colourTertiary: '#CC9900',
        },
        control_blocks: {
            colourPrimary: '#FFAB19',
            colourSecondary: '#EC9C13',
            colourTertiary: '#CF8B17',
        },
        sensing_blocks: {
            colourPrimary: '#5CB1D6',
            colourSecondary: '#47A8D1',
            colourTertiary: '#2E8EB8',
        },
        operator_blocks: {
            colourPrimary: '#59C059',
            colourSecondary: '#46B946',
            colourTertiary: '#389438',
        },
        variable_blocks: {
            colourPrimary: '#FF8C1A',
            colourSecondary: '#FF8000',
            colourTertiary: '#DB6E00',
        },
        procedure_blocks: {
            colourPrimary: '#FF6680',
            colourSecondary: '#FF4D6A',
            colourTertiary: '#FF3355',
        },
    },
    categoryStyles: {
        motion_category: { colour: '#4C97FF' },
        looks_category: { colour: '#9966FF' },
        sound_category: { colour: '#CF63CF' },
        event_category: { colour: '#FFBF00' },
        control_category: { colour: '#FFAB19' },
        sensing_category: { colour: '#5CB1D6' },
        operator_category: { colour: '#59C059' },
        variable_category: { colour: '#FF8C1A' },
        procedure_category: { colour: '#FF6680' },
    },
    componentStyles: {
        workspaceBackgroundColour: '#F9F9F9',
        toolboxBackgroundColour: '#FFFFFF',
        toolboxForegroundColour: '#575E75',
        flyoutBackgroundColour: '#F9F9F9',
        flyoutForegroundColour: '#575E75',
        flyoutOpacity: 0.9,
        scrollbarColour: '#CECDCE',
        scrollbarOpacity: 0.5,
        insertionMarkerColour: '#000000',
        insertionMarkerOpacity: 0.3,
    },
    fontStyle: {
        family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        weight: 'bold',
        size: 12,
    },
    startHats: true,
});