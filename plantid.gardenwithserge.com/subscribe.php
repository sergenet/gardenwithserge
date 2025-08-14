<?php
// Test/debug: output POST data if present
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "<h2>Received Subscription Request</h2>";
    echo "<strong>POST Data:</strong><pre>";
    print_r($_POST);
    echo "</pre>";
    // Here is where you will put Stripe or PayPal handling code!
} else {
    // Show a test subscription form
    ?>
    <h2>Subscribe to a Plan</h2>
    <form method="POST" action="subscribe.php">
        <label>
            Email:<br>
            <input type="email" name="email" required>
        </label>
        <br><br>
        <label>
            Plan:<br>
            <select name="membership_type" required>
                <option value="">Select...</option>
                <option value="basic_monthly">Basic - Monthly</option>
                <option value="basic_yearly">Basic - Yearly</option>
                <option value="green_thumb_monthly">Green Thumb - Monthly</option>
                <option value="green_thumb_yearly">Green Thumb - Yearly</option>
            </select>
        </label>
        <br><br>
        <label>
            Payment Provider:<br>
            <select name="payment_provider" required>
                <option value="">Select...</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
            </select>
        </label>
        <br><br>
        <!-- In a real system, you'd integrate Stripe Elements or PayPal JS SDK here instead of a button! -->
        <button type="submit">Subscribe</button>
    </form>
    <?php
}
?>