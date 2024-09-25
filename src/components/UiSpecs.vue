<template>
    <div
        class="spec"
    >
        <p class="spec-type">{{ type }}</p> <!--type of the spec-->
        <p class="spec-content">{{ content }}</p> <!--artist's value for the specs-->
    </div>
</template>

<script>

export default {
    props: {
        type: {
            type: String,
            default: '',
        },
        content: {
            type: [String,Number],
            default: '',
        }
    }
}

</script>