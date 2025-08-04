<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" theme="light" :trigger="null" collapsible>
      <div
          :style="collapsed
    ? 'display: flex; justify-content: center; align-items: center; padding: 16px;'
    : 'display: flex; align-items: center; padding: 16px;'"
      >
        <img
            v-if="!collapsed"
            src="@/assets/fiqirs_logo.jpeg"
            alt="Logo"
            class="logo-img logo"
            style="height: 40px; margin-right: 12px;"
        />
        <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
            style="font-size: 20px; cursor: pointer;"
        />
        <menu-fold-outlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
            style="font-size: 20px; cursor: pointer; margin-left: auto;"
        />
      </div>


      <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline">
        <a-sub-menu key="sub1">
          <template #icon>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
              <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"></path>
              <path d="M15.9 20.11l0 .01"></path>
              <path d="M19.04 17.61l0 .01"></path>
              <path d="M20.77 14l0 .01"></path>
              <path d="M20.77 10l0 .01"></path>
              <path d="M19.04 6.39l0 .01"></path>
              <path d="M15.9 3.89l0 .01"></path>
              <path d="M12 3l0 .01"></path>
              <path d="M8.1 3.89l0 .01"></path>
              <path d="M4.96 6.39l0 .01"></path>
              <path d="M3.23 10l0 .01"></path>
              <path d="M3.23 14l0 .01"></path>
              <path d="M4.96 17.61l0 .01"></path>
              <path d="M8.1 20.11l0 .01"></path>
              <path d="M12 21l0 .01"></path>
            </svg>
          </template>
          <template #title>
            Live
          </template>
          <a-menu-item key="everyWhere">EveryWhere</a-menu-item>
          <a-menu-item key="ercot">ERCOT</a-menu-item>
          <a-menu-item key="caiso">CAISO</a-menu-item>
          <a-menu-item key="spp">SPP</a-menu-item>
          <a-menu-item key="pjm">PJM</a-menu-item>
          <a-menu-item key="miso">MISO</a-menu-item>
          <a-menu-item key="nyiso">NYISO</a-menu-item>
          <a-menu-item key="isone">ISONE</a-menu-item>
          <a-menu-item key="ieso">IESO</a-menu-item>
        </a-sub-menu>

        <a-menu-item key="sub2">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 19l-4 -2l-6 3v-13l6 -3l6 3l6 -3v8.5"></path>
              <path d="M9 4v13"></path>
              <path d="M15 7v7.5"></path>
              <path d="M19 16l-2 3h4l-2 3"></path>
            </svg>
          </template>
          <span>Price Map</span>
        </a-menu-item>

        <a-menu-item key="sub3">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h6v8h-6z"></path>
              <path d="M4 16h6v4h-6z"></path>
              <path d="M14 12h6v8h-6z"></path>
              <path d="M14 4h6v4h-6z"></path>
            </svg>
          </template>
          <span>Charts & Dashboards</span>
        </a-menu-item>

        <a-menu-item key="sub4">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
              <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
            </svg>
          </template>
          <span>Alerts</span>
        </a-menu-item>

        <a-menu-item key="sub5">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 21l8 0"></path>
              <path d="M12 17l0 4"></path>
              <path d="M7 4l10 0"></path>
              <path d="M17 4v8a5 5 0 0 1 -10 0v-8"></path>
              <path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
              <path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
            </svg>
          </template>
          <span>Record Tracker</span>
        </a-menu-item>

        <a-menu-item key="sub6">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.673 15.36a4.978 4.978 0 0 1 -2.673 -1.36a5 5 0 0 0 -7 0v-9a5 5 0 0 1 7 0a5 5 0 0 0 7 0v7"></path>
              <path d="M5 21v-7"></path>
              <path d="M19 16l-2 3h4l-2 3"></path>
            </svg>
          </template>
          <span>EIA Browser</span>
        </a-menu-item>

        <a-menu-item key="sub7">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z"></path>
              <path d="M3 10h18"></path>
              <path d="M10 3v18"></path>
            </svg>
          </template>
          <span>Data Category</span>
        </a-menu-item>

        <a-menu-item key="sub8">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3"></path>
              <path d="M4 6v6c0 1.657 3.582 3 8 3c1.118 0 2.183 -.086 3.15 -.241"></path>
              <path d="M20 12v-6"></path>
              <path d="M4 12v6c0 1.657 3.582 3 8 3c.157 0 .312 -.002 .466 -.005"></path>
              <path d="M16 19h6"></path>
              <path d="M19 16l3 3l-3 3"></path>
            </svg>
          </template>
          <span>Export Data</span>
        </a-menu-item>


        <a-menu-item key="sub9">
          <template #icon>
            <!-- 图标直接放在 icon 插槽中 -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
              <path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
              <path d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
              <path d="M14 7l6 0"></path>
              <path d="M17 4l0 6"></path>
            </svg>
          </template>
          <span>All Apps</span>
        </a-menu-item>

      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!--  顶部导航    -->
      <a-layout-header
          style="background: #fff; padding: 0 15px; display: flex; align-items: center; justify-content: start; gap: 10px;"
      >
        <router-link
            to="/home/everyWhere"
            class="nav-link"
            active-class="nav-link-active"
        >
          <a-button type="primary" class="custom-button-active">
            EveryWhere
          </a-button>
        </router-link>

        <router-link
            to="/home/electric"
            class="nav-link"
            active-class="nav-link-active"
        >
          <a-button type="primary" class="custom-button-non-active">
            Electric Reliability Council of Texas
          </a-button>
        </router-link>

        <router-link
            to="/home/californiaISO"
            class="nav-link"
            active-class="nav-link-active"
        >
          <a-button type="primary" class="custom-button-non-active">
            California ISO
          </a-button>
        </router-link>
        <router-link
            to="/home/southwestPowerPool"
            class="nav-link"
            active-class="nav-link-active"
        >
          <a-button type="primary" class="custom-button-non-active">
            Southwest Power Pool
          </a-button>
        </router-link>

        <router-link
            to="/home/pjm"
            class="nav-link"
            active-class="nav-link-active"
        >
          <a-button type="primary" class="custom-button-non-active">
            PJM
          </a-button>
        </router-link>


        <router-link
            to="/home/midcontinentISO"
            class="nav-link"
            active-class="nav-link-active"
        >
          <a-button type="primary" class="custom-button-non-active">
            Midcontinent ISO
          </a-button>
        </router-link>

        <router-link
            to="xx"
            class="nav-link"
            active-class="nav-link-active"
        >
          <a-button type="primary" class="custom-button-non-active">
            New York ISO
          </a-button>
        </router-link>

        <router-link
            to="xx"
            class="nav-link"
            active-class="nav-link-active"
        >
          <a-button type="primary" class="custom-button-non-active">
            ISO New England
          </a-button>
        </router-link>
        <router-link
            to="xx"
            class="nav-link"
            active-class="nav-link-active"
        >
          <a-button type="primary" class="custom-button-non-active">
            IESO
          </a-button>
        </router-link>
      </a-layout-header>

      <!--   主要内容   -->
      <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>


<script lang="ts" setup>
import {LogoutOutlined} from '@ant-design/icons-vue';
import {ref} from 'vue';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  AreaChartOutlined,
  EyeOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';

const selectedKeys = ref<string[]>(['1']);
const collapsed = ref<boolean>(false);


</script>
<style>


.logo-img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

#components-layout-demo-custom-trigger .trigger {
  margin-left: 100px;
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin-left: 20px;
}

.nav-link {
  color: #000; /* 默认黑色 */
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  color: #52c41a;
}

.custom-button-active {
  background: rgb(58, 125, 93);
}

.custom-button-non-active:hover {
  background-color: #3a7d5d !important; /* 鼠标悬停时的背景色 */
  border-color: #bbb !important;
  color: #000000;
}

.custom-button-non-active {
  background: rgb(255, 255, 255);
  color: rgb(131, 136, 144);
}


/*menu item*/
.menu-item {
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
}

</style>
