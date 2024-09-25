<template>
    <button :value="text" @click="navigate()">
        <i :class="icon"></i>
        <p>{{ text }}</p>
    </button>
</template>

<script>
export default {
    name: "UiButton",
    props: {
        text: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: "",
        },
        to: {
            type: String,
            default: "",
        }
    },
    methods: {
        navigate() {
            this.$router.push({ name: this.to });
        }
    }
}
</script>
