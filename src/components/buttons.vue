<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        buttons: {
            type: Array,
            required: true,
            validator: (value) => value.every(button => 
                typeof button === 'object' && 
                button !== null && 
                (button.label || button.icon) && 
                typeof button.action === 'function'
            )
        },
        baseClass: {
            type: String,
            default: 'inline-block py-2 px-4 rounded-md font-semibold transition-colors duration-300'
        },
        fullWidth: {
            type: Boolean,
            default: false
        },
        buttonExtraClass: { 
            type: String,
            default: ''
        }
    });

    const buttonClasses = computed(() => (button) => {
        let classes = [props.baseClass]; 
        
        if (props.fullWidth) {
            classes.push('w-full');
        }
        if (button.class) { // Classi specifiche per un singolo pulsante nell'array
            classes.push(button.class);
        }
        if (props.buttonExtraClass) { // Classi extra passate tramite la nuova prop
            classes.push(props.buttonExtraClass);
        }

        const finalClasses = classes.join(' ');
        console.log(`[Buttons.vue] Classi finali per il pulsante "${button.label}":`, finalClasses); // DEBUG
        return finalClasses;
    });
</script>

<template>
    <div class="flex gap-x-4"> 
        <button 
            v-for="(button, index) in buttons" 
            :key="button.id || index"  
            @click="button.action" 
            :class="buttonClasses(button)"
        >
            {{ button.label }}
        </button>
    </div>
</template>