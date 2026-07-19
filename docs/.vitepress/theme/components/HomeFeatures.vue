<template>
  <section class="customFeaturesWrap" v-for="(f, i) in features" :key="i">
    <h2 class="home_title">{{ f.text }}</h2>
    <div class="featuresItemsWrap">


      <section v-for="(h) in f.items">
        <template v-if="h.items && h.items.length > 0" :key="h.text">
          <h3>{{ h.text }}</h3>
          <section class="items">
            <div class="item" v-for="(i) in h.items">
              <a class="VPFeature" :href="`${useData().site.value.base.slice(0, -1)}${i.link}`">
                <article class="box">
                  <span class="title">{{ i.text }}</span>
                </article>
              </a>
            </div>
          </section>
        </template>
        <template v-else>
          <section class="items">
            <div class="item">
              <a class="VPFeature" :href="`${useData().site.value.base.slice(0, -1)}${h.link}`">
                <article class="box">
                  <span class="title">{{ h.text }}</span>
                </article>
              </a>
            </div>
          </section>
        </template>
      </section>
    </div>
  </section>
</template>

<script setup>
import { useData } from 'vitepress'
const { site } = useData()
const features = site.value.themeConfig.nav || []
</script>

<style scoped>
.customFeaturesWrap {
  & + & {
    margin-top: 2rem;
  }
  .home_title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--vp-home-hero-name-color)
  }

  .featuresItemsWrap {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  h3 {
    margin: 1rem 0 1rem;
  }
  .items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(30%, 300px), 1fr));
    gap: 1rem;
    .VPFeature {
      display: block;
      border: 1px solid var(--vp-c-bg-soft);
      border-radius: 12px;
      height: 100%;
      background-color: var(--vp-c-bg-soft);
      transition: border-color 0.25s, background-color 0.25s;
      color: var(--vp-c-text-base);
      text-decoration: none;
      cursor: pointer;
      &:hover {
        border-color: var(--vp-c-brand-1);
      }
      .box {
        display: flex;
        flex-direction: column;
        padding: 24px;
        height: 100%;
        .title {
          font-size: 1rem;
          line-height: 1.5rem;
          font-weight: 600;
        }
      }
    }
  }
}
</style>