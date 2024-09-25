<template>
    <main>
        <ui-button class="homeButton"
            to="home"
        />
        <ui-button class="close"
            icon="fa-solid fa-xmark"
            to="home"
        />
        <div class="centerRow">
            <h3 class="titulo">
                Estreia
            </h3>
            <h4 class="info">
                O ano em que o álbum de estreia do artista foi lançado. Se não tiverem álbuns, primeira música.
            </h4>
            <div class="tipo">
                <div class="differentResults">
                    <p>
                        Incorreto
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(253, 176, 2, 0.7)">
                    <p>
                        Dentro de <br>
                        5 anos
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(34, 140, 34, 0.8)">
                    <p>
                        Correto
                    </p>
                </div>
            </div>
            <h3 class="titulo">
                Membros
            </h3>
            <h4 class="info">
                O número de membros do grupo. Se os membros vierem e partirem, será a formação mais conhecida.
            </h4>
            <div class="tipo">
                <div class="differentResults">
                <p>
                        Incorreto
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(253, 176, 2, 0.7)">
                    <p>
                        Dentro de 1 <br>
                        membro
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(34, 140, 34, 0.8)">
                    <p>
                        Correto
                    </p>
                </div>
            </div>
            <h3 class="titulo">
                Ouvintes
            </h3>
            <h4 class="info">
                Número de ouvintes mensais no Spotify.
            </h4>
            <div class="tipo">
                <div class="differentResults">
                    <p>
                        Incorreto
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(253, 176, 2, 0.7)">
                    <p>
                        Dentro de 50k <br>
                        ouvintes
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(34, 140, 34, 0.8)">
                    <p>
                        Correto
                    </p>
                </div>
            </div>
            <h3 class="titulo">
                Género
            </h3>
            <h4 class="info">
                O género do artista. Se for um grupo com homens e mulheres, dirá Ambos.
            </h4>
            <div class="tipo">
                <div class="differentResults">
                    <p>
                        Incorreto
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(34, 140, 34, 0.8)">
                    <p>
                        Correto
                    </p>
                </div>
            </div>
            <h3 class="titulo">
                Tipo
            </h3>
            <h4 class="info">
                O tipo de música dos artistas. As opções são: Pop, Fado, Hip-Hop, Rock, Clássico, Jazz, 
                Folclore, Eletrónica, Pimba, Metal, Comédia, R&B, Reggae, Indie.
            </h4>
            <div class="tipo">
                <div class="differentResults">
                    <p>
                        Incorreto
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(34, 140, 34, 0.8)">
                    <p>
                        Correto
                    </p>
                </div>
            </div>
            <h3 class="titulo">
                Região
            </h3>
            <h4 class="info">
                Onde o artista nasceu. Pode ter nascido dentro de Portugal ou fora com origem Portuguesa
            </h4>
            <div class="tipo">
                <div class="differentResults">
                    <p>
                        Incorreto
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(253, 176, 2, 0.7)">
                    <p>
                        Em Portugal <br>
                        ou não
                    </p>
                </div>
                <div class="differentResults" style="background-color:rgba(34, 140, 34, 0.8)">
                    <p>
                        Correto
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import UiButton from '@/components/UiButton.vue';

export default {
    components: {
        UiButton
    }
}

</script>