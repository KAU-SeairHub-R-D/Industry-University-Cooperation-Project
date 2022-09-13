package com.seairhub.driver.util

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.seairhub.driver.R
import com.seairhub.driver.src.splash.SplashActivity

class MyFirebaseMessagingService : FirebaseMessagingService() {

    // 메세지 수신시
    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        println("From : ${message.from}")

        if (message.data.isNotEmpty()) {
            println("Message data payload : ${message.data}")

            sendNotification(message.notification!!.body!!)
        }
    }

    // 토큰 생성시
    override fun onNewToken(token: String) {
        super.onNewToken(token)

        println("Refreshed token : $token")

        // FCM 등록 토큰을 서버에 전송
    }

    private fun sendNotification(body : String) {
        val intent = Intent(this, SplashActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val pendingIntent = PendingIntent.getActivity(this, 100, intent, PendingIntent.FLAG_ONE_SHOT)
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        val notificationBuilder = NotificationCompat.Builder(this, "@string/default_notification_channel_id")
            .setContentTitle(getString(R.string.app_name))
            .setContentText(body)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setContentIntent(pendingIntent)
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        notificationManager.notify(100, notificationBuilder.build())
    }
}