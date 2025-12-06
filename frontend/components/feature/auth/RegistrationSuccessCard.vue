<script setup lang="ts">
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/shadcn'

interface Props {
  userEmail: string
}

defineProps<Props>()

const isResending = ref(false)
</script>

<template>
  <div class="space-y-6">
    <Card class="border-green-200 bg-green-50">
      <CardHeader class="pb-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <div class="i-heroicons-check-circle text-green-600 w-6 h-6" />
          </div>
          <CardTitle class="text-2xl text-green-900">
            Inscription réussie !
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <CardDescription class="text-base text-green-800">
          Vous devriez recevoir un email à l'adresse <strong class="font-semibold">{{ userEmail }}</strong> pour valider votre compte.
        </CardDescription>

        <div class="rounded-md bg-white p-4 border border-green-200">
          <p class="text-sm text-gray-700 mb-2">
            <strong>Prochaines étapes :</strong>
          </p>
          <ul class="text-sm text-gray-600 space-y-1.5 list-disc list-inside mb-3">
            <li>Vérifiez votre boîte de réception</li>
            <li>Cliquez sur le lien de validation dans l'email</li>
            <li>Connectez-vous avec vos identifiants</li>
          </ul>

          <!-- Lien de renvoi d'email -->
          <div class="pt-3 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              Vous ne recevez pas l'email dans votre boîte de réception ?
              <Button
                variant="link"
                size="sm"
                :disabled="isResending"
                class="h-auto p-0 ml-1 text-sm"
              >
                Essayer de le renvoyer
              </Button>
            </p>
          </div>
        </div>

        <div class="pt-2">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            Aller à la page de connexion
          </NuxtLink>
        </div>
      </CardContent>
    </Card>

  </div>
</template>